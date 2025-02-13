import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest, // ✅ Use NextRequest instead of Request
  context: { params: { category: string; slug: string } }  // ✅ Explicitly define as context
) {
  try {
    const { category, slug } = context.params; // ✅ Extract from `context.params`

    const { data: note, error } = await supabase
      .from('notes')
      .select(`
        *,
        categories!inner(id, name, slug)
      `)
      .eq('categories.slug', category)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const formattedNote = {
      id: note.id,
      title: note.title,
      slug: note.slug,
      content: note.content,
      technology: note.technology,
      category_name: note.categories.name,
      category_slug: note.categories.slug,
      created_at: note.created_at
    };

    return NextResponse.json({ note: formattedNote });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
