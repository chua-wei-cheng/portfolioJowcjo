"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookText, BriefcaseIcon, CodeIcon, GraduationCapIcon, HomeIcon, TrophyIcon, LockIcon } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from '@/lib/auth/AuthContext'

const publicRoutes = [
  {
    label: "Overview",
    icon: HomeIcon,
    href: "/",
  },
  {
    label: "Experience",
    icon: BriefcaseIcon,
    href: "/experience",
  },
  {
    label: "Projects",
    icon: CodeIcon,
    href: "/projects",
  },
  {
    label: "Education",
    icon: GraduationCapIcon,
    href: "/education",
  },
  {
    label: "Skills",
    icon: TrophyIcon,
    href: "/skills",
  },
  {
    label: "Notes",
    icon: BookText,
    href: "/notes",
  },
]

const adminRoutes = [
  {
    label: "Admin Dashboard",
    icon: LockIcon,
    href: "/admin/dashboard",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const routes = user ? [...publicRoutes, ...adminRoutes] : publicRoutes

  return (
    <div className="hidden fixed border-r bg-background md:block w-64 mt-14 h-[calc(100vh-3.5rem)]">
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                    pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

