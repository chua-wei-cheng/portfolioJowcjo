"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import NoteContent from '@/components/note-content'
import { PlusCircle, Trash2 } from 'lucide-react'

type ContentBlock = {
  type: 'text' | 'code'
  content: string
  language?: string
}

type Note = {
  id: number
  title: string
  slug: string
  content: ContentBlock[]
  technology: string
  category_id: number
  category: {
    name: string
    slug: string
  }
}

type Category = {
  id: number
  name: string
  slug: string
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([{ type: 'text', content: '' }])
  const [technology, setTechnology] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [slugError, setSlugError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
    fetchCategories()
  }, [])

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      })
    } else {
      setNotes(data)
    }
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } else {
      setCategories(data)
    }
  }

  const handleContentChange = (index: number, content: string) => {
    const newBlocks = [...contentBlocks]
    newBlocks[index].content = content
    setContentBlocks(newBlocks)
  }

  const handleLanguageChange = (index: number, language: string) => {
    const newBlocks = [...contentBlocks]
    newBlocks[index].language = language
    setContentBlocks(newBlocks)
  }

  const addContentBlock = (type: 'text' | 'code') => {
    setContentBlocks([...contentBlocks, { type, content: '', language: type === 'code' ? 'javascript' : undefined }])
  }

  const removeContentBlock = (index: number) => {
    const newBlocks = contentBlocks.filter((_, i) => i !== index)
    setContentBlocks(newBlocks)
  }

  const handleSlugChange = (value: string) => {
    const newSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setSlug(newSlug)
  }

  const checkSlugUniqueness = async () => {
    if (!slug) return

    const { data, error } = await supabase
      .from('notes')
      .select('id')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking slug uniqueness:', error)
      setSlugError('Error checking slug uniqueness')
    } else if (data) {
      setSlugError('This slug is already in use')
    } else {
      setSlugError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!categoryId) {
        throw new Error("Please select a category")
      }

      if (slugError) {
        throw new Error("Please use a unique slug")
      }

      const { error } = await supabase
        .from('notes')
        .insert([{ title, slug, content: contentBlocks, technology, category_id: categoryId }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Note added successfully!",
      })
      setTitle('')
      setSlug('')
      setContentBlocks([{ type: 'text', content: '' }])
      setTechnology('')
      setCategoryId(null)
      fetchNotes()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Manage Notes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Note</CardTitle>
          <CardDescription>Create a new tech note</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug">Slug</label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                onBlur={checkSlugUniqueness}
                required
              />
              {slugError && <p className="text-red-500 text-sm">{slugError}</p>}
            </div>
            <div className="space-y-2">
              <label>Content</label>
              {contentBlocks.map((block, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  {block.type === 'text' ? (
                    <Textarea
                      value={block.content}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      placeholder="Enter text content"
                      required
                    />
                  ) : (
                    <div className="space-y-2">
                      <Input
                        value={block.language || ''}
                        onChange={(e) => handleLanguageChange(index, e.target.value)}
                        placeholder="Language (e.g., javascript)"
                      />
                      <Textarea
                        value={block.content}
                        onChange={(e) => handleContentChange(index, e.target.value)}
                        placeholder="Enter code content"
                        required
                      />
                    </div>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => removeContentBlock(index)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Block
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Button type="button" variant="outline" size="sm" onClick={() => addContentBlock('text')}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Text Block
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addContentBlock('code')}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Code Block
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="technology">Technology</label>
              <Input
                id="technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Select onValueChange={(value) => setCategoryId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || !!slugError}>
              {loading ? 'Adding...' : 'Add Note'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Notes</h2>
        {notes.map((note) => (
          <Card key={note.id} className="mb-4">
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>
                Technology: {note.technology} | Category: {note.category.name} | Slug: {note.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NoteContent content={note.content} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}