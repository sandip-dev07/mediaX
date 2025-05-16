import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createTweet } from "@/lib/twitter-client"

export async function GET(request: Request) {
  // Verify the request is from a trusted source (e.g., Vercel Cron)
  const authHeader = request.headers.get("Authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all scheduled tweets that are due
    const scheduledTweets = await prisma.scheduledTweet.findMany({
      where: {
        posted: false,
        scheduledFor: {
          lte: new Date(),
        },
      },
    })

    const results = []

    for (const tweet of scheduledTweets) {
      try {
        // Post the tweet to Twitter
        const tweetData = await createTweet(tweet.content, tweet.mediaIds)

        // Update the scheduled tweet
        await prisma.scheduledTweet.update({
          where: { id: tweet.id },
          data: {
            posted: true,
            tweetId: tweetData.id,
          },
        })

        // Create a record in the tweets table
        await prisma.tweet.create({
          data: {
            content: tweet.content,
            mediaIds: tweet.mediaIds,
            tweetId: tweetData.id,
            userId: tweet.userId,
          },
        })

        results.push({
          id: tweet.id,
          status: "posted",
          tweetId: tweetData.id,
        })
      } catch (error) {
        console.error(`Error posting scheduled tweet ${tweet.id}:`, error)
        results.push({
          id: tweet.id,
          status: "error",
          error: (error as Error).message,
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error posting scheduled tweets:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
