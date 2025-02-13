import { supabase } from './supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  
  console.log('Fetched categories:', data) // Add this line for debugging
  return data
}

export async function getNotesByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('category_id', categorySlug)
    .order('title')
  
  if (error) throw error
  return data
}

export async function getNoteContent(categorySlug: string, noteSlug: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*, categories(name)')
    .eq('category_id', categorySlug)
    .eq('slug', noteSlug)
    .single()
  
  if (error) throw error
  return {
    ...data,
    category_name: data.categories.name
  }
}