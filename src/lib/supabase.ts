import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface LectureData {
  user_id?: string;
  title: string;
  transcript: string;
  hierarchical_notes: string;
  diagram_code: string;
  summary: string;
  quiz: any;
}

/**
 * Uploads a processed lecture to the Supabase database.
 */
export async function upload_lecture(data: LectureData) {
  const { data: result, error } = await supabase
    .from('lectures')
    .insert([
      {
        user_id: data.user_id,
        title: data.title,
        transcript: data.transcript,
        hierarchical_notes: data.hierarchical_notes,
        diagram_code: data.diagram_code,
        summary: data.summary,
        quiz: data.quiz,
      },
    ])
    .select();

  if (error) {
    console.error('Error uploading lecture:', error);
    throw error;
  }
  return result;
}

/**
 * Signs up a new user with Supabase Auth.
 */
export async function signUpUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Signs in an existing user with Supabase Auth.
 */
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Signs out the current user.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetches the watched classes (lectures) for a specific user.
 */
export async function getUserWatchedClasses(userId: string) {
  const { data, error } = await supabase
    .from('lectures')
    .select('id, title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
