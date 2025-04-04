import { createClient } from './supabase';
import type { Project } from '@/types/database';

export async function getProjects(userId: string): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function checkVerifierStatus(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('verifiers')
    .select('is_verifier')
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.is_verifier || false;
}

export async function getVerifierProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'Pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
