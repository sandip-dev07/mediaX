"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { createTweet as createTwitterTweet, uploadMedia } from "@/lib/twitter-client"

export async function createTweet(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return { success: false, error: "You must be logged in to create a tweet" }
  }

  const content = formData.get("content") as string

  if (!content || content.trim() === "") {
    return { success: false, error: "Tweet content cannot be empty" }
  }

  try {
    // Handle media uploads
    const mediaIds = await handleMediaUploads(formData)

    // Create tweet on Twitter
    const tweetData = await createTwitterTweet(content, mediaIds)

    // Save tweet to database
    const tweet = await prisma.tweet.create({
      data: {
        content,
        mediaIds,
        tweetId: tweetData.id,
        userId: session.user.id,
      },
    })

    revalidatePath("/dashboard")

    return { success: true, tweet }
  } catch (error) {
    console.error("Error creating tweet:", error)
    return { success: false, error: (error as Error).message || "Failed to create tweet" }
  }
}

export async function scheduleTweet(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return { success: false, error: "You must be logged in to schedule a tweet" }
  }

  const content = formData.get("content") as string
  const dateString = formData.get("date") as string
  const timeString = formData.get("time") as string

  if (!content || content.trim() === "") {
    return { success: false, error: "Tweet content cannot be empty" }
  }

  if (!dateString || !timeString) {
    return { success: false, error: "Date and time are required" }
  }

  try {
    // Handle media uploads
    const mediaIds = await handleMediaUploads(formData)

    const [hours, minutes] = timeString.split(":").map(Number)
    const scheduledDate = new Date(dateString)
    scheduledDate.setHours(hours, minutes)

    // Save scheduled tweet to database
    const scheduledTweet = await prisma.scheduledTweet.create({
      data: {
        content,
        mediaIds,
        scheduledFor: scheduledDate,
        userId: session.user.id,
      },
    })

    revalidatePath("/dashboard/scheduled")

    return { success: true, scheduledTweet }
  } catch (error) {
    console.error("Error scheduling tweet:", error)
    return { success: false, error: (error as Error).message || "Failed to schedule tweet" }
  }
}

async function handleMediaUploads(formData: FormData) {
  const mediaIds: string[] = []

  // Check for media files
  for (let i = 0; i < 4; i++) {
    const mediaFile = formData.get(`media_${i}`) as File

    if (mediaFile && mediaFile.size > 0) {
      try {
        // Convert File to Buffer
        const arrayBuffer = await mediaFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Twitter
        const mediaId = await uploadMedia(buffer, mediaFile.type)
        mediaIds.push(mediaId)
      } catch (error) {
        console.error(`Error uploading media file ${i}:`, error)
      }
    }
  }

  return mediaIds
}

export async function getScheduledTweets() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("You must be logged in to view scheduled tweets")
  }

  try {
    const scheduledTweets = await prisma.scheduledTweet.findMany({
      where: {
        userId: session.user.id,
        posted: false,
      },
      orderBy: {
        scheduledFor: "asc",
      },
    })

    return scheduledTweets
  } catch (error) {
    console.error("Error getting scheduled tweets:", error)
    throw error
  }
}

export async function deleteScheduledTweet(id: string) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("You must be logged in to delete a scheduled tweet")
  }

  try {
    await prisma.scheduledTweet.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })

    revalidatePath("/dashboard/scheduled")

    return { success: true }
  } catch (error) {
    console.error("Error deleting scheduled tweet:", error)
    return { success: false, error: (error as Error).message || "Failed to delete scheduled tweet" }
  }
}

export async function postScheduledTweet(id: string) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("You must be logged in to post a scheduled tweet")
  }

  try {
    // Get the scheduled tweet
    const scheduledTweet = await prisma.scheduledTweet.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!scheduledTweet) {
      throw new Error("Scheduled tweet not found")
    }

    // Post the tweet to Twitter
    const tweetData = await createTwitterTweet(scheduledTweet.content, scheduledTweet.mediaIds)

    // Update the scheduled tweet
    await prisma.scheduledTweet.update({
      where: { id },
      data: {
        posted: true,
        tweetId: tweetData.id,
      },
    })

    // Create a record in the tweets table
    await prisma.tweet.create({
      data: {
        content: scheduledTweet.content,
        mediaIds: scheduledTweet.mediaIds,
        tweetId: tweetData.id,
        userId: session.user.id,
      },
    })

    revalidatePath("/dashboard/scheduled")

    return { success: true }
  } catch (error) {
    console.error("Error posting scheduled tweet:", error)
    return { success: false, error: (error as Error).message || "Failed to post scheduled tweet" }
  }
}

export async function getRecentTweets() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("You must be logged in to view tweets")
  }

  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    return tweets
  } catch (error) {
    console.error("Error getting recent tweets:", error)
    throw error
  }
}
