import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client'

export async function GET() {
   try {
       const { data: projects, error } = await supabase
           .from('projects')
           .select('*')
           .order('id', { ascending: false });

       if (error) throw error;

       // Ensure the image URL is a public URL
       const projectsWithPublicUrls = projects.map(project => ({
           ...project,
           image: project.image ? supabase.storage.from('project-images').getPublicUrl(project.image).data.publicUrl : null
       }));

       return NextResponse.json({ projects: projectsWithPublicUrls });
   } catch (error) {
       console.error('Error fetching projects:', error);
       return NextResponse.json({ projects: [], error: 'Failed to fetch projects' }, { status: 500 });
   }
}

