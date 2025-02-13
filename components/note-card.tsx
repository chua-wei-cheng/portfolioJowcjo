import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Note = {
  id: number
  title: string
  content: string
  technology: string
}

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{note.technology}</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
          {note.content.substring(0, 100)}...
        </pre>
      </CardContent>
    </Card>
  )
}