"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface FileDownload {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  createdAt: Date;
}

export function FilesTable() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileDownload | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: 0,
    fileUrl: "",
    fileName: "",
    fileSize: "",
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const snapshot = await getDocs(collection(db, "files"));
      const filesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as FileDownload[];
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الملفات.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (file?: FileDownload) => {
    if (file) {
      setEditingFile(file);
      setFormValues({
        title: file.title,
        description: file.description,
        price: file.price,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        fileSize: file.fileSize,
      });
    } else {
      setEditingFile(null);
      setFormValues({
        title: "",
        description: "",
        price: 0,
        fileUrl: "",
        fileName: "",
        fileSize: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    // Validation
    if (!formValues.title?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال عنوان الملف.", variant: "destructive" });
      return;
    }

    if (!formValues.fileUrl?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال رابط الملف.", variant: "destructive" });
      return;
    }

    // Validate URL
    try {
      new URL(formValues.fileUrl);
    } catch {
      toast({ title: "خطأ", description: "رابط الملف غير صالح.", variant: "destructive" });
      return;
    }

    if (formValues.price <= 0) {
      toast({ title: "خطأ", description: "السعر يجب أن يكون أكبر من صفر.", variant: "destructive" });
      return;
    }

    try {
      if (editingFile) {
        // Update existing file
        const fileRef = doc(db, "files", editingFile.id);
        await updateDoc(fileRef, {
          ...formValues,
          updatedAt: serverTimestamp(),
        });

        toast({ title: "تم التحديث", description: "تم تحديث الملف بنجاح." });
      } else {
        // Add new file
        await addDoc(collection(db, "files"), {
          ...formValues,
          createdAt: serverTimestamp(),
        });

        toast({ title: "تمت الإضافة", description: "تمت إضافة الملف بنجاح." });
      }

      setIsDialogOpen(false);
      fetchFiles();
    } catch (error) {
      console.error("Error saving file:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ الملف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;

    try {
      await deleteDoc(doc(db, "files", fileId));
      toast({ title: "تم الحذف", description: "تم حذف الملف بنجاح." });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف الملف. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(files.length / itemsPerPage);
  const paginatedFiles = files.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-white text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">إدارة الملفات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-primary">
              <Plus className="h-4 w-4 ml-2" />
              إضافة ملف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingFile ? "تعديل الملف" : "إضافة ملف جديد"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">عنوان الملف *</label>
                <Input
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                  className="glass text-white"
                  placeholder="مثال: كتاب برمجة الشبكات"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">الوصف</label>
                <Textarea
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  className="glass text-white"
                  placeholder="وصف مختصر عن الملف..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">السعر (IQD) *</label>
                  <Input
                    type="number"
                    value={formValues.price}
                    onChange={(e) => setFormValues({ ...formValues, price: Number(e.target.value) })}
                    className="glass text-white"
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">حجم الملف</label>
                  <Input
                    value={formValues.fileSize}
                    onChange={(e) => setFormValues({ ...formValues, fileSize: e.target.value })}
                    className="glass text-white"
                    placeholder="مثال: 5.2 MB"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">رابط الملف *</label>
                <Input
                  value={formValues.fileUrl}
                  onChange={(e) => setFormValues({ ...formValues, fileUrl: e.target.value })}
                  className="glass text-white"
                  placeholder="https://example.com/file.pdf"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">اسم الملف</label>
                <Input
                  value={formValues.fileName}
                  onChange={(e) => setFormValues({ ...formValues, fileName: e.target.value })}
                  className="glass text-white"
                  placeholder="مثال: book.pdf"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="glass"
                >
                  إلغاء
                </Button>
                <Button onClick={handleSaveChanges} className="btn-primary">
                  {editingFile ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">العنوان</TableHead>
              <TableHead className="text-gray-300">الوصف</TableHead>
              <TableHead className="text-gray-300">السعر</TableHead>
              <TableHead className="text-gray-300">حجم الملف</TableHead>
              <TableHead className="text-gray-300">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                  لا توجد ملفات حالياً
                </TableCell>
              </TableRow>
            ) : (
              paginatedFiles.map((file) => (
                <TableRow key={file.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">{file.title}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {file.description || "-"}
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    {file.price.toLocaleString('ar-IQ')} IQD
                  </TableCell>
                  <TableCell className="text-gray-300">{file.fileSize || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(file)}
                        className="glass"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="glass text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-300">
            صفحة {currentPage} من {totalPages} ({files.length} ملف)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="glass"
            >
              <ChevronRight className="h-4 w-4" /> السابق
            </Button>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="glass"
            >
              التالي <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
