import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*');

        if (error) throw error;

        return NextResponse.json({ notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ notes: [], error: 'Failed to fetch notes' }, { status: 500 });
    }
}

