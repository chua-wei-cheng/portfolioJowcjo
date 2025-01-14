import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react'
import Image from "next/image"
import { weichengProfilePicture } from '../assets/WeiChengProfileBase64';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

async function getLatestExperience() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/experience`, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.experience[0]; // Return the first (latest) experience
  } catch (error) {
    console.error('Error fetching latest experience:', error);
    return null;
  }
}

async function getRandomProject() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/projects`, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const randomIndex = Math.floor(Math.random() * data.projects.length);
    return data.projects[randomIndex];
  } catch (error) {
    console.error('Error fetching random project:', error);
    return null;
  }
}

async function getSkills() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/skills`, { next: { revalidate: 60 } });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.skills.slice(0, 5); // Return top 5 skills
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export default async function OverviewPage() {
  const latestExperience = await getLatestExperience();
  const featuredProject = await getRandomProject();
  const topSkills = await getSkills();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <Image
          src={weichengProfilePicture}
          alt="Profile"
          width={200}
          height={200}
          className="rounded-full object-cover"
          priority
        />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Chua Wei Cheng</h1>
          <h2 className="text-2xl text-muted-foreground">Software and Devops Engineer</h2>
          <p className="text-lg max-w-2xl">
          Enthusiastic software engineer specializing in React, Next.js, and cutting-edge web technologies. 
          Skilled in developing scalable applications and proficient in React Native. 
          Trained in DevOps practices.
          </p>
          <p className="text-lg font-semibold text-primary">
          Available for new opportunities with 1 month notice.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <a href="https://github.com/chua-wei-cheng" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="https://www.linkedin.com/in/chua-wei-cheng" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </Button> 
            <Button variant="outline" size="icon">
              <a href="mailto:chuaweicheng@hotmail.com" target="_blank" rel="noopener noreferrer">
                <MailIcon className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {latestExperience ? (
          <Card>
            <CardHeader>
              <CardTitle>Latest Experience</CardTitle>
              <CardDescription>Most recent professional journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{latestExperience.title}</div>
                <div className="text-sm text-muted-foreground">{latestExperience.company} • {latestExperience.period}</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Latest Experience</CardTitle>
              <CardDescription>Unable to load experience data</CardDescription>
            </CardHeader>
          </Card>
        )}

        {featuredProject ? (
          <Card>
            <CardHeader>
              <CardTitle>Featured Project</CardTitle>
              <CardDescription>Highlighted work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{featuredProject.title}</div>
                <div className="text-sm text-muted-foreground">{featuredProject.technologies.join(' • ')}</div>
                <p className="text-sm">{featuredProject.description}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Featured Project</CardTitle>
              <CardDescription>Unable to load project data</CardDescription>
            </CardHeader>
          </Card>
        )}

        {topSkills.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Top Skills</CardTitle>
              <CardDescription>Key technical expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill: { id: any; name: any; }) => (
                  <div
                    key={skill.id}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Top Skills</CardTitle>
              <CardDescription>Unable to load skills data</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
          <CardDescription>A bit more personal</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            When I'm not coding, you can find me exploring new hiking trails or experimenting with fusion recipes in the kitchen. 
            I'm currently working on improving my Japanese language skills and have a goal to read a full novel in Japanese by the end of the year.
          </p>
          <div className="mt-4">
            <h4 className="font-semibold">Current Focus:</h4>
            <ul className="list-disc list-inside text-sm">
              <li>Deepening my knowledge of cloud architecture and serverless technologies</li>
              <li>Contributing to open-source projects in the React ecosystem</li>
              <li>Exploring machine learning applications in web development</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

