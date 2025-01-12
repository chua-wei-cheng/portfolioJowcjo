"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Manage your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/skills">
              <Button>Manage Skills</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Manage your notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/notes">
              <Button>Manage Notes</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Manage your education</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/education">
              <Button>Manage Education</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/projects">
              <Button>Manage Projects</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
            <CardDescription>Manage your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/experience">
              <Button>Manage Experience</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

