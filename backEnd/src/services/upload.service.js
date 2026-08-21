import supabase from '../config/supabase.js';

const BUCKET = 'recipe-images'; // create this bucket (public) in your Supabase dashboard

export async function uploadImage(buffer, filename, mimetype) {
    const path = `recipes/${Date.now()}-${filename}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: mimetype, upsert: false });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

export async function deleteImage(url) {
    const path = url.split(`/${BUCKET}/`)[1];
    if (!path) return;
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
}