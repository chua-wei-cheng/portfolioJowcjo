'use client';

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCapIcon } from 'lucide-react'

type Education = {
  id: number
  degree: string
  school: string
  period: string
  description: string
  achievements: string[]
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch('/api/education');
        if (!response.ok) {
          throw new Error('Failed to fetch education');
        }
        const data = await response.json();
        setEducation(data.education);
      } catch (error) {
        console.error('Error fetching education:', error);
        setError('Failed to fetch education');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return <div>Loading education...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Education</h1>
        <p className="text-muted-foreground mt-2">Academic background and achievements</p>
      </div>

      <div className="grid gap-6">
        {education.map((edu) => (
          <Card key={edu.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <GraduationCapIcon className="h-8 w-8" />
              <div>
                <CardTitle>{edu.degree}</CardTitle>
                <CardDescription>{edu.school} • {edu.period}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{edu.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Achievements:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

