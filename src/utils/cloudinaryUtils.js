// src/utils/cloudinaryUtils.js
import {
  cloudName,
  apiKey,
  apiSecret,
  uploadPreset,
  cloudinaryUploadUrl,
} from "./cloudinaryConfig";

function sha1Hash(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return crypto.subtle.digest("SHA-1", data).then((buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

export async function deleteImageFromCloudinary(publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1Hash(stringToSign);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  return result;
}

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(cloudinaryUploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url; // return URL gambar
}
