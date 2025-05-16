import type React from "react"
import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TweetSync - Schedule your Twitter content",
  description: "The simplest way to post and grow on Twitter(X).",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
            {children}
            <Toaster />
          {/* </ThemeProvider> */}
        </AuthProvider>
      </body>
    </html>
  )
}
