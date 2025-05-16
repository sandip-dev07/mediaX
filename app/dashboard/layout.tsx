import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | TweetSync",
  description: "Manage your Twitter content",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session server-side
  const session = await getServerSession(authOptions);

  // Debug - log the session
  console.log("Session in dashboard layout:", !!session);

  if (!session || !session.user) {
    // If no session, redirect to login
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Twitter className="h-6 w-6" />
              <span className="font-bold">TweetSync</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
