import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client'

export async function GET() {
    try {
        const { data: skills, error } = await supabase
            .from('skills')
            .select('*');

        if (error) throw error;

        return NextResponse.json({ skills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json({ skills: [], error: 'Failed to fetch skills', details: error }, { status: 500 });
    }
}

