"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MediaUpload } from "@/components/media-upload"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Send } from "lucide-react"
import { createTweet, scheduleTweet } from "@/lib/twitter-actions"
import { toast } from "@/hooks/use-toast"

export function ComposeForm() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("12:00")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setContent(text)
    setCharCount(text.length)
  }

  const handleMediaChange = (files: File[]) => {
    setMediaFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Tweet content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(formRef.current!)

      // Add media files to form data
      mediaFiles.forEach((file, index) => {
        formData.append(`media_${index}`, file)
      })

      if (isScheduling && date) {
        formData.append("date", date.toISOString())
        formData.append("time", time)

        const result = await scheduleTweet(formData)

        if (result.success) {
          toast({
            title: "Tweet scheduled",
            description: `Your tweet has been scheduled for ${format(date, "PPP")} at ${time}`,
          })

          setContent("")
          setDate(undefined)
          setTime("12:00")
          setIsScheduling(false)
          setMediaFiles([])
          router.push("/dashboard/scheduled")
        } else {
          throw new Error(result.error || "Failed to schedule tweet")
        }
      } else {
        const result = await createTweet(formData)

        if (result.success) {
          toast({
            title: "Tweet posted",
            description: "Your tweet has been posted successfully",
          })

          setContent("")
          setMediaFiles([])
          router.push("/dashboard")
        } else {
          throw new Error(result.error || "Failed to post tweet")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "There was an error processing your request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              name="content"
              placeholder="What's happening?"
              className="min-h-[120px] resize-none"
              value={content}
              onChange={handleContentChange}
              maxLength={280}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{charCount}/280</span>
            </div>
          </div>

          <MediaUpload onMediaChange={handleMediaChange} />

          <div className="flex items-center gap-2">
            <div className="ml-auto flex items-center gap-2">
              {isScheduling && (
                <>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        type="time"
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-[120px]"
                      />
                    </div>
                    <Input type="hidden" name="date" value={date ? date.toISOString() : ""} />
                  </div>
                </>
              )}
              <Button type="button" variant="outline" onClick={() => setIsScheduling(!isScheduling)}>
                {isScheduling ? "Post now" : "Schedule"}
              </Button>
              <Button type="submit" disabled={!content || isSubmitting}>
                {isSubmitting ? (
                  "Processing..."
                ) : isScheduling ? (
                  "Schedule"
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Tweet
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
