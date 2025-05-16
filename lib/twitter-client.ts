import { TwitterApi } from "twitter-api-v2"

// OAuth 1.0a credentials (from your environment variables)
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || process.env.TWITTER_CLIENT_ID
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || process.env.TWITTER_CLIENT_SECRET
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET

// Create a client with OAuth 1.0a app-only credentials
export function getTwitterClient() {
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET) {
    throw new Error("Twitter API credentials are not properly configured")
  }

  return new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
  })
}

export async function createTweet(content: string, mediaIds: string[] = []) {
  const client = getTwitterClient()

  try {
    const tweetData =
      mediaIds.length > 0
        ? await client.v2.tweet(content, { media: { media_ids: mediaIds } })
        : await client.v2.tweet(content)

    return tweetData.data
  } catch (error) {
    console.error("Error creating tweet:", error)
    throw error
  }
}

export async function uploadMedia(buffer: Buffer, mimeType: string) {
  const client = getTwitterClient()

  try {
    const mediaId = await client.v1.uploadMedia(buffer, { mimeType })
    return mediaId
  } catch (error) {
    console.error("Error uploading media:", error)
    throw error
  }
}
