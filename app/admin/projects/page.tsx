"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase-client'
import { v4 as uuidv4 } from 'uuid'

export default function AdminProjectsPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = ''
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const { error } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            technologies: technologies.split(',').map(tech => tech.trim()),
            github_url: githubUrl,
            demo_url: demoUrl,
            image: imageUrl
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Project added successfully!",
      })

      // Reset form
      setTitle('')
      setDescription('')
      setTechnologies('')
      setGithubUrl('')
      setDemoUrl('')
      setImage(null)
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Safely access the `message` property
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Handle non-Error cases (fallback message)
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
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
          <CardDescription>Create a new project entry</CardDescription>
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
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="technologies">Technologies (comma-separated)</label>
              <Input
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="React, TypeScript, Tailwind"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="githubUrl">GitHub URL</label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="demoUrl">Demo URL</label>
              <Input
                id="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="image">Project Image</label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

