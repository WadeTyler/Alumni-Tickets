import cloudinary from '../config/cloudinary.config.js';

export async function handleUpload(file: string) {
  const result = await cloudinary.uploader.upload(file, { folder: "alumni_events" });
  return result.secure_url;
}