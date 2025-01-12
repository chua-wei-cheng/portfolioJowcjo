import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon, GithubIcon } from 'lucide-react'
import Image from "next/image"
import { supabase } from '@/lib/supabase-client'

type Project = {
  id: number
  title: string
  description: string
  technologies: string[]
  github_url: string
  demo_url: string
  image: string | null
}

async function getProjects(): Promise<Project[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects.map(project => ({
    ...project,
    image: project.image ? supabase.storage.from('project-images').getPublicUrl(project.image).data.publicUrl : null
  }));
}

export default async function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsList />
    </Suspense>
  )
}

async function ProjectsList() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-2">Showcase of technical projects and applications</p>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="w-full object-cover h-48"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  No image available
                </div>
              )}
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {tech.trim()}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="h-4 w-4 mr-2" />
                        Source Code
                      </a>
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button size="sm" asChild>
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>No projects found. Please check your database connection.</div>
      )}
    </div>
  )
}

