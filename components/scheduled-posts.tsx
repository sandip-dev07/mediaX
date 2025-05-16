"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Send, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getScheduledTweets, deleteScheduledTweet, postScheduledTweet } from "@/lib/twitter-actions"
import { useRouter } from "next/navigation"

export function ScheduledPosts() {
  const router = useRouter()
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchScheduledTweets() {
      try {
        const tweets = await getScheduledTweets()
        setScheduledPosts(tweets)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load scheduled tweets",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchScheduledTweets()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteScheduledTweet(id)

      if (result.success) {
        setScheduledPosts(scheduledPosts.filter((post) => post.id !== id))
        toast({
          title: "Post deleted",
          description: "The scheduled post has been deleted",
        })
      } else {
        throw new Error(result.error || "Failed to delete scheduled tweet")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete scheduled tweet",
        variant: "destructive",
      })
    }
  }

  const handlePostNow = async (id: string) => {
    try {
      const result = await postScheduledTweet(id)

      if (result.success) {
        setScheduledPosts(scheduledPosts.filter((post) => post.id !== id))
        toast({
          title: "Post sent",
          description: "Your tweet has been posted successfully",
        })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to post scheduled tweet")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to post scheduled tweet",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading scheduled tweets...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduledPosts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No scheduled posts
              </TableCell>
            </TableRow>
          ) : (
            scheduledPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.content}</TableCell>
                <TableCell>
                  {format(new Date(post.scheduledFor), "PPP")} at {format(new Date(post.scheduledFor), "p")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handlePostNow(post.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        <span>Post now</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/compose/edit/${post.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
