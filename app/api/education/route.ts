import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: education, error } = await supabase
            .from('education')
            .select('*');

        if (error) throw error;

        return NextResponse.json({ education });
    } catch (error) {
        console.error('Error fetching education:', error);
        return NextResponse.json({ education: [], error: 'Failed to fetch education' }, { status: 500 });
    }
}

