import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // First, get the category_id based on the slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (categoryError) throw categoryError;
    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const categoryId = categoryData.id;

    // Now fetch notes with the correct category_id
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select(`
        id,
        title,
        slug
      `)
      .eq('category_id', categoryId);

    if (notesError) throw notesError;

    if (!notes || notes.length === 0) {
      return NextResponse.json({ notes: [] });
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}