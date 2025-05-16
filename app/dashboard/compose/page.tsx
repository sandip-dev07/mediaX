import type { Metadata } from "next"
import { ComposeForm } from "@/components/compose-form"

export const metadata: Metadata = {
  title: "Compose | TweetSync",
  description: "Create and schedule Twitter content",
}

export default function ComposePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Compose Tweet</h2>
      <ComposeForm />
    </div>
  )
}
