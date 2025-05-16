"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart, Calendar, Home, Settings } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-4">
      <Link href="/dashboard">
        <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/compose">
        <Button variant={pathname === "/dashboard/compose" ? "default" : "ghost"} className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </Link>
      <Link href="/dashboard/scheduled">
        <Button variant={pathname === "/dashboard/scheduled" ? "default" : "ghost"} className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Scheduled
        </Button>
      </Link>
      <Link href="/dashboard/analytics">
        <Button variant={pathname === "/dashboard/analytics" ? "default" : "ghost"} className="w-full justify-start">
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </Link>
      <Link href="/dashboard/settings">
        <Button variant={pathname === "/dashboard/settings" ? "default" : "ghost"} className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
    </nav>
  )
}
