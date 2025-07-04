import { supabase } from './supabaseClient';

export const uploadFile = async (file, path) => {
  if (!file || !path) {
    throw new Error('File and path are required');
  }

  const { data, error } = await supabase.storage
    .from('wiki-files')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error.message);
    throw error;
  }

  const { data: publicURLData } = supabase.storage
    .from('wiki-files')
    .getPublicUrl(path);

  return publicURLData?.publicUrl;
};
