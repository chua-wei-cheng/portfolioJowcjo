"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

type Experience = {
  id: number
  title: string
  company: string
  period: string
  description: string
  technologies: string[]
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [period, setPeriod] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    const { data, error } = await supabase.from('experience').select('*')
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      })
    } else {
      setExperiences(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('experience')
        .insert([{ 
          title, 
          company, 
          period, 
          description, 
          technologies: technologies.split(',').map(t => t.trim())
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Experience added successfully!",
      })
      setTitle('')
      setCompany('')
      setPeriod('')
      setDescription('')
      setTechnologies('')
      fetchExperiences()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Manage Experience</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Experience</CardTitle>
          <CardDescription>Add a new work experience to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Job Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company">Company</label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="period">Period</label>
              <Input
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
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
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Experience'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Experiences</h2>
        {experiences.map((exp) => (
          <Card key={exp.id} className="mb-4">
            <CardHeader>
              <CardTitle>{exp.title}</CardTitle>
              <CardDescription>{exp.company} • {exp.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{exp.description}</p>
              <div className="mt-2">
                <strong>Technologies:</strong> {exp.technologies.join(', ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

