import { NextResponse } from "next/server"
import { getTwitterClient } from "@/lib/twitter-client"

export async function GET() {
  try {
    const client = getTwitterClient()

    // Test the credentials by getting the user's profile
    const user = await client.v2.me()

    return NextResponse.json({
      success: true,
      user: user.data,
      message: "Twitter API credentials are working correctly!",
    })
  } catch (error) {
    console.error("Error testing Twitter API:", error)

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        message: "Twitter API credentials are not working correctly.",
      },
      { status: 500 },
    )
  }
}
