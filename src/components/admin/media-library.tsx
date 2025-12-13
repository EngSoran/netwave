"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteFile, MediaCategory } from "@/lib/storage";
import { ImageUploadDialog } from "./image-upload-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MediaFile {
  id: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  category: MediaCategory;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  altText?: string;
}

export function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MediaCategory | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [mediaFiles, searchQuery, categoryFilter]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(
        query(collection(db, "media"), orderBy("uploadedAt", "desc"))
      );

      const files = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      })) as MediaFile[];

      setMediaFiles(files);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الوسائط",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = () => {
    let filtered = [...mediaFiles];

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((file) => file.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  };

  const handleUploadComplete = async (url: string, category: MediaCategory) => {
    try {
      // Extract file name from URL
      const fileName = url.split("/").pop()?.split("?")[0] || "unknown";

      // Add to Firestore
      await addDoc(collection(db, "media"), {
        fileName,
        fileUrl: url,
        storagePath: `media/${category}/${fileName}`,
        category,
        fileSize: 0, // We don't track this in upload, could be enhanced
        mimeType: "image/*",
        uploadedBy: "admin", // Could be dynamic based on current user
        uploadedAt: serverTimestamp(),
      });

      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة الملف إلى المكتبة",
      });

      fetchMedia();
    } catch (error) {
      console.error("Error adding to library:", error);
      toast({
        title: "خطأ",
        description: "فشل إضافة الملف إلى المكتبة",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`هل أنت متأكد من حذف "${file.fileName}"؟`)) {
      return;
    }

    try {
      // Delete from Storage
      await deleteFile(file.fileUrl);

      // Delete from Firestore
      await deleteDoc(doc(db, "media", file.id));

      toast({
        title: "تم الحذف",
        description: "تم حذف الملف بنجاح",
      });

      fetchMedia();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف الملف",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة",
    });
  };

  const getCategoryLabel = (category: MediaCategory) => {
    const labels: Record<MediaCategory, string> = {
      "hero-images": "صور الغلاف",
      "service-images": "صور الخدمات",
      "gallery": "المعرض",
      "icons": "الأيقونات",
      "other": "أخرى",
    };
    return labels[category];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass text-white pr-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as MediaCategory | "all")}>
            <SelectTrigger className="glass text-white w-40">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              <SelectItem value="hero-images">صور الغلاف</SelectItem>
              <SelectItem value="service-images">صور الخدمات</SelectItem>
              <SelectItem value="gallery">المعرض</SelectItem>
              <SelectItem value="icons">الأيقونات</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <Button onClick={() => setUploadDialogOpen(true)} className="btn-primary">
          <Upload className="h-4 w-4 ml-2" />
          رفع صورة
        </Button>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-300">
        عرض {filteredFiles.length} من أصل {mediaFiles.length} ملف
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 glass rounded-lg">
          <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <p className="text-white mb-2">لا توجد ملفات</p>
          <p className="text-gray-400 text-sm mb-4">
            {searchQuery || categoryFilter !== "all"
              ? "لم يتم العثور على نتائج. جرب تغيير البحث أو الفلتر."
              : "ابدأ برفع صورك الأولى"}
          </p>
          {!searchQuery && categoryFilter === "all" && (
            <Button onClick={() => setUploadDialogOpen(true)} className="btn-primary">
              <Upload className="h-4 w-4 ml-2" />
              رفع صورة
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="glass rounded-lg overflow-hidden group hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square bg-black/20 overflow-hidden">
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyToClipboard(file.fileUrl)}
                    title="نسخ الرابط"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => window.open(file.fileUrl, "_blank")}
                    title="فتح"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(file)}
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <p className="text-white text-sm font-medium truncate" title={file.fileName}>
                  {file.fileName}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryLabel(file.category)}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {file.uploadedAt.toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
