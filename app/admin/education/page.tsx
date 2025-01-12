"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

type Education = {
  id: number
  degree: string
  school: string
  period: string
  description: string
  achievements: string[]
}

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([])
  const [degree, setDegree] = useState('')
  const [school, setSchool] = useState('')
  const [period, setPeriod] = useState('')
  const [description, setDescription] = useState('')
  const [achievements, setAchievements] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    const { data, error } = await supabase.from('education').select('*')
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch education entries",
        variant: "destructive",
      })
    } else {
      setEducations(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('education')
        .insert([{ 
          degree, 
          school, 
          period, 
          description, 
          achievements: achievements.split('\n').filter(a => a.trim() !== '')
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Education entry added successfully!",
      })
      setDegree('')
      setSchool('')
      setPeriod('')
      setDescription('')
      setAchievements('')
      fetchEducations()
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
      <h1 className="text-3xl font-bold mb-5">Manage Education</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Education Entry</CardTitle>
          <CardDescription>Add a new education qualification</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="degree">Degree</label>
              <Input
                id="degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="school">School</label>
              <Input
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
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
              <label htmlFor="achievements">Achievements (one per line)</label>
              <Textarea
                id="achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Education'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Education Entries</h2>
        {educations.map((edu) => (
          <Card key={edu.id} className="mb-4">
            <CardHeader>
              <CardTitle>{edu.degree}</CardTitle>
              <CardDescription>{edu.school} • {edu.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{edu.description}</p>
              <ul className="list-disc list-inside mt-2">
                {edu.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

