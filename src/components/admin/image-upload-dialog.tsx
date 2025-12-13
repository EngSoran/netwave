"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile, MediaCategory, UploadProgress, formatFileSize } from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (url: string, category: MediaCategory) => void;
  defaultCategory?: MediaCategory;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
  defaultCategory = "other",
}: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "خطأ",
        description: "يُرجى اختيار ملف للرفع",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadProgress({ progress: 0, status: "uploading" });

      const downloadURL = await uploadFile(selectedFile, category, (progress) => {
        setUploadProgress(progress);
      });

      toast({
        title: "نجح الرفع",
        description: "تم رفع الملف بنجاح",
      });

      onUploadComplete(downloadURL, category);
      handleClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "خطأ في الرفع",
        description: error.message || "فشل رفع الملف",
        variant: "destructive",
      });
      setUploadProgress({ progress: 0, status: "error", error: error.message });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(null);
    setCategory(defaultCategory);
    onOpenChange(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">رفع صورة جديدة</DialogTitle>
          <DialogDescription>
            اختر صورة من جهازك لرفعها (الحد الأقصى 5 ميجابايت)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-white">التصنيف</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as MediaCategory)}>
              <SelectTrigger className="glass text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="hero-images">صور الغلاف</SelectItem>
                <SelectItem value="service-images">صور الخدمات</SelectItem>
                <SelectItem value="gallery">المعرض</SelectItem>
                <SelectItem value="icons">الأيقونات</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          {!selectedFile && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-white/30 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-white">أفلت الملف هنا...</p>
              ) : (
                <>
                  <p className="text-white mb-2">اسحب وأفلت صورة هنا، أو انقر للاختيار</p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, GIF, WEBP, SVG (حد أقصى 5MB)
                  </p>
                </>
              )}
            </div>
          )}

          {/* File Preview */}
          {selectedFile && previewUrl && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-white/20">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain bg-black/20"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2"
                  onClick={removeFile}
                  disabled={uploadProgress?.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="glass rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{selectedFile.name}</span>
                  <span className="text-gray-300 text-sm">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>

                {/* Upload Progress */}
                {uploadProgress && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress.progress} className="h-2" />
                    <div className="flex items-center gap-2">
                      {uploadProgress.status === "uploading" && (
                        <>
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-gray-300">
                            جاري الرفع... {Math.round(uploadProgress.progress)}%
                          </span>
                        </>
                      )}
                      {uploadProgress.status === "completed" && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">تم الرفع بنجاح!</span>
                        </>
                      )}
                      {uploadProgress.status === "error" && (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-500">
                            {uploadProgress.error || "فشل الرفع"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="glass">
              إلغاء
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadProgress?.status === "uploading"}
              className="btn-primary"
            >
              {uploadProgress?.status === "uploading" ? "جاري الرفع..." : "رفع الصورة"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
