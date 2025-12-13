import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from "firebase/storage";

export type MediaCategory =
  | "hero-images"
  | "service-images"
  | "gallery"
  | "icons"
  | "other";

export interface UploadProgress {
  progress: number;
  status: "uploading" | "completed" | "error";
  downloadURL?: string;
  error?: string;
}

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param category - The category folder to upload to
 * @param onProgress - Callback for upload progress updates
 * @returns Promise with download URL
 */
export const uploadFile = (
  file: File,
  category: MediaCategory = "other",
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const error = "حجم الملف يجب أن يكون أقل من 5 ميجابايت";
      onProgress?.({ progress: 0, status: "error", error });
      reject(new Error(error));
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      const error = "نوع الملف غير مدعوم. يُرجى رفع صورة (JPG, PNG, GIF, WEBP, SVG)";
      onProgress?.({ progress: 0, status: "error", error });
      reject(new Error(error));
      return;
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}_${randomString}_${file.name}`;
    const storagePath = `media/${category}/${filename}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Start upload
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({ progress, status: "uploading" });
      },
      (error) => {
        console.error("Upload error:", error);
        const errorMessage = getStorageErrorMessage(error);
        onProgress?.({ progress: 0, status: "error", error: errorMessage });
        reject(error);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onProgress?.({ progress: 100, status: "completed", downloadURL });
          resolve(downloadURL);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The download URL of the file to delete
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract the storage path from the download URL
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

    if (!pathMatch) {
      throw new Error("رابط الملف غير صالح");
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/**
 * Get user-friendly error messages for Firebase Storage errors
 */
function getStorageErrorMessage(error: any): string {
  const errorCode = error.code;

  switch (errorCode) {
    case "storage/unauthorized":
      return "ليس لديك صلاحية لرفع الملفات. يُرجى تسجيل الدخول كمسؤول.";
    case "storage/canceled":
      return "تم إلغاء رفع الملف.";
    case "storage/unknown":
      return "حدث خطأ غير معروف. يُرجى المحاولة مرة أخرى.";
    case "storage/object-not-found":
      return "الملف غير موجود.";
    case "storage/quota-exceeded":
      return "تم تجاوز حصة التخزين المتاحة.";
    case "storage/unauthenticated":
      return "يُرجى تسجيل الدخول للمتابعة.";
    default:
      return error.message || "حدث خطأ أثناء رفع الملف.";
  }
}

/**
 * Validate if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};
