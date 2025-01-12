"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

type Skill = {
  id: number
  name: string
  level: number
  category: string
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*')
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      })
    } else {
      setSkills(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('skills')
        .insert([{ name, level: parseInt(level), category }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Skill added successfully!",
      })
      setName('')
      setLevel('')
      setCategory('')
      fetchSkills()
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
      <h1 className="text-3xl font-bold mb-5">Manage Skills</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Add a new skill to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Skill Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="level">Skill Level (0-100)</label>
              <Input
                id="level"
                type="number"
                min="0"
                max="100"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Skill'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Skills</h2>
        {skills.map((skill) => (
          <Card key={skill.id} className="mb-4">
            <CardHeader>
              <CardTitle>{skill.name}</CardTitle>
              <CardDescription>{skill.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Level: {skill.level}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

