'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from '@/lib/auth/AuthContext'
import { getCategories } from '@/lib/data'

type Category = {
  id: string
  name: string
  slug: string
  description: string
}

export default function NotesList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...') // Add this line for debugging
        const fetchedCategories = await getCategories()
        console.log('Fetched categories:', fetchedCategories) // Add this line for debugging
        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <div>Loading categories...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/notes/${category.slug}`} className="block">
              <Card>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {!user && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Login to create new notes</CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}