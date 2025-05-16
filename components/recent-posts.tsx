"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { getRecentTweets } from "@/lib/twitter-actions"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export function RecentPosts() {
  const { data: session } = useSession()
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentTweets() {
      try {
        const tweets = await getRecentTweets()
        setRecentPosts(tweets)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recent tweets",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentTweets()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading recent tweets...</div>
  }

  if (recentPosts.length === 0) {
    return <div className="text-center p-4">No recent tweets found</div>
  }

  return (
    <div className="space-y-8">
      {recentPosts.map((post) => (
        <div key={post.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
            <p className="text-sm">{post.content}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a
                href={`https://twitter.com/intent/like?tweet_id=${post.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Like
              </a>
              <a
                href={`https://twitter.com/intent/retweet?tweet_id=${post.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Retweet
              </a>
              <a
                href={`https://twitter.com/intent/tweet?in_reply_to=${post.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Reply
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
