import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client'

export async function GET() {
    try {
        const { data: experience, error } = await supabase
            .from('experience')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) throw error;

        // Ensure description is an array
        const formattedExperience = experience.map(exp => ({
            ...exp,
            description: Array.isArray(exp.description) ? exp.description : [exp.description]
        }));

        return NextResponse.json({ experience: formattedExperience });
    } catch (error) {
        console.error('Error fetching experience:', error);
        return NextResponse.json({ experience: [], error: 'Failed to fetch experience', details: error }, { status: 500 });
    }
}

