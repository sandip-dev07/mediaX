"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

interface MediaUploadProps {
  onMediaChange: (files: File[]) => void
}

export function MediaUpload({ onMediaChange }: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    if (files.length + mediaFiles.length > 4) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 4 media files",
        variant: "destructive",
      })
      return
    }

    // Check file types and sizes
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      const isValidType = isImage || isVideo

      const isValidSize = file.size <= 20 * 1024 * 1024 // 20MB max

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image or video`,
          variant: "destructive",
        })
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit`,
          variant: "destructive",
        })
      }

      return isValidType && isValidSize
    })

    if (validFiles.length === 0) return

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file))

    setMediaFiles((prev) => [...prev, ...validFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
    onMediaChange([...mediaFiles, ...validFiles])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveMedia = (index: number) => {
    const newMediaFiles = [...mediaFiles]
    const newPreviews = [...previews]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])

    newMediaFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setMediaFiles(newMediaFiles)
    setPreviews(newPreviews)
    onMediaChange(newMediaFiles)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden border">
            <Image
              src={preview || "/placeholder.svg"}
              alt={`Media preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleRemoveMedia(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={mediaFiles.length >= 4}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Add Media
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">{mediaFiles.length}/4 files (max 20MB each)</p>
      </div>
    </div>
  )
}
