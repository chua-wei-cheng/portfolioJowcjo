'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import NoteContent from '@/components/note-content'
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ContentBlock = {
  type: 'text' | 'code'
  content: string
  language?: string
}

type Note = {
  id: string
  title: string
  content: ContentBlock[] | string
  technology: string
  category_name: string
  slug: string
  created_at: string
}

export default function NotePage({ params: paramsPromise }: { params: Promise<{ category: string; slug: string }> }) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  
  const params = React.use(paramsPromise);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${params.category}/${params.slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch note');
        }

        setNote(data.note);
      } catch (error) {
        console.error('Error fetching note:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [params.category, params.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-3xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-xl text-foreground">{error || 'Note not found'}</p>
        <Button asChild className="mt-8">
          <Link href="/notes">
            Back to Categories
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/notes/${params.category}`} className="inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {params.category} Notes
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold">{note.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Badge variant="secondary" className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {note.category_name}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(note.created_at).toLocaleDateString()}
              </Badge>
              <Badge variant="default">
                {note.technology}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <NoteContent content={note.content} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}