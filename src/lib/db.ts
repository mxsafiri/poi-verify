import { supabase } from './supabase';
import type { Database, Project, Verifier } from '@/types/database';

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: Database['public']['Tables']['projects']['Insert']): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(
  id: string,
  update: Database['public']['Tables']['projects']['Update']
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function checkVerifierStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('verifiers')
    .select('is_verifier')
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.is_verifier || false;
}

export async function getVerifierProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'Pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
