import type { Metadata } from "next"
import { ScheduledPosts } from "@/components/scheduled-posts"

export const metadata: Metadata = {
  title: "Scheduled Posts | TweetSync",
  description: "View and manage your scheduled Twitter content",
}

export default function ScheduledPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Scheduled Posts</h2>
      <ScheduledPosts />
    </div>
  )
}
