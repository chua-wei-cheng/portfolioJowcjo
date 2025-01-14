'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/lib/auth/AuthContext'

type Note = {
  id: number
  title: string
  content: string
  technology: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data.notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tech Notes</h1>
        <p className="text-muted-foreground mt-2">Quick reference notes for various technologies</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>{note.technology}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                {note.content}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {!user && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center mb-4">Login to create new notes</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

