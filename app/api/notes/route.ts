import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug
      `)
      .order('name', { ascending: true });

    if (error) throw error;

    if (!categories || categories.length === 0) {
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}