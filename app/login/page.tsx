"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Twitter } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const error = searchParams?.get("error")

  // If there's an error from NextAuth, show it
  useEffect(() => {
    if (error) {
      // toast({
      //   title: "Authentication Error",
      //   description: `Error: ${error}`,
      //   variant: "destructive",
      // })
    }
  }, [error])

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl)
    }
  }, [status, session, router, callbackUrl])

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      const result = await signIn("twitter", {
        callbackUrl,
        redirect: true,
      })

      // If we get this far, something went wrong with the redirect
      if (!result?.ok) {
        throw new Error("Failed to sign in with Twitter")
      }
    } catch (error) {
      // toast({
      //   title: "Authentication Failed",
      //   description: (error as Error).message || "Failed to authenticate with Twitter",
      //   variant: "destructive",
      // })
      setIsLoading(false)
    }
  }

  // If the user is already authenticated, show a loading state
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authenticating...</CardTitle>
            <CardDescription>Please wait while we sign you in</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to TweetSync</CardTitle>
          <CardDescription>Connect your Twitter account to get started</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleLogin} disabled={isLoading} size="lg" className="w-full">
            <Twitter className="mr-2 h-4 w-4" />
            {isLoading ? "Connecting..." : "Sign in with Twitter"}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}
