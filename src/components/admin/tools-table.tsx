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
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  category?: string;
  createdAt: Date;
}

export function ToolsTable() {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    url: "",
    icon: "",
    category: "",
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tools"));
      const toolsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Tool[];
      setTools(toolsData);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الأدوات.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setFormValues({
        title: tool.title,
        description: tool.description,
        url: tool.url,
        icon: tool.icon || "",
        category: tool.category || "",
      });
    } else {
      setEditingTool(null);
      setFormValues({
        title: "",
        description: "",
        url: "",
        icon: "",
        category: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    // Validation
    if (!formValues.title?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال اسم الأداة.", variant: "destructive" });
      return;
    }

    if (!formValues.url?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال رابط الأداة.", variant: "destructive" });
      return;
    }

    // Validate URL
    try {
      new URL(formValues.url);
    } catch {
      toast({ title: "خطأ", description: "رابط الأداة غير صالح.", variant: "destructive" });
      return;
    }

    try {
      const toolData = {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        url: formValues.url.trim(),
        icon: formValues.icon.trim() || "🔧",
        category: formValues.category.trim() || "عام",
      };

      if (editingTool) {
        // Update existing tool
        const toolRef = doc(db, "tools", editingTool.id);
        await updateDoc(toolRef, {
          ...toolData,
          updatedAt: serverTimestamp(),
        });

        toast({ title: "تم التحديث", description: "تم تحديث الأداة بنجاح." });
      } else {
        // Add new tool
        await addDoc(collection(db, "tools"), {
          ...toolData,
          createdAt: serverTimestamp(),
        });

        toast({ title: "تمت الإضافة", description: "تمت إضافة الأداة بنجاح." });
      }

      setIsDialogOpen(false);
      fetchTools();
    } catch (error) {
      console.error("Error saving tool:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ الأداة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الأداة؟")) return;

    try {
      await deleteDoc(doc(db, "tools", toolId));
      toast({ title: "تم الحذف", description: "تم حذف الأداة بنجاح." });
      fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف الأداة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const paginatedTools = tools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-white text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">إدارة الأدوات</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-primary">
              <Plus className="h-4 w-4 ml-2" />
              إضافة أداة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingTool ? "تعديل الأداة" : "إضافة أداة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">اسم الأداة *</label>
                <Input
                  value={formValues.title}
                  onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                  className="glass text-white"
                  placeholder="مثال: استخراج الدومينات"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">الوصف</label>
                <Textarea
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  className="glass text-white"
                  placeholder="وصف مختصر عن الأداة وفائدتها..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">رابط الأداة *</label>
                <Input
                  value={formValues.url}
                  onChange={(e) => setFormValues({ ...formValues, url: e.target.value })}
                  className="glass text-white"
                  placeholder="https://www.example.com/tool"
                  dir="ltr"
                />
                <p className="text-xs text-gray-400 mt-1">
                  مثال: https://www.vedbex.com/subdomain-finder/zaincash.iq
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">الأيقونة (Emoji)</label>
                  <Input
                    value={formValues.icon}
                    onChange={(e) => setFormValues({ ...formValues, icon: e.target.value })}
                    className="glass text-white text-center text-2xl"
                    placeholder="🔧"
                    maxLength={2}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    اختياري - استخدم emoji
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">الفئة</label>
                  <Input
                    value={formValues.category}
                    onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                    className="glass text-white"
                    placeholder="مثال: أدوات الشبكات"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    اختياري - افتراضياً "عام"
                  </p>
                </div>
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
                  {editingTool ? "تحديث" : "إضافة"}
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
              <TableHead className="text-gray-300">الأيقونة</TableHead>
              <TableHead className="text-gray-300">الاسم</TableHead>
              <TableHead className="text-gray-300">الوصف</TableHead>
              <TableHead className="text-gray-300">الفئة</TableHead>
              <TableHead className="text-gray-300">الرابط</TableHead>
              <TableHead className="text-gray-300">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  لا توجد أدوات حالياً. ابدأ بإضافة الأداة الأولى!
                </TableCell>
              </TableRow>
            ) : (
              paginatedTools.map((tool) => (
                <TableRow key={tool.id} className="border-gray-700">
                  <TableCell className="text-3xl">{tool.icon || "🔧"}</TableCell>
                  <TableCell className="text-white font-medium">{tool.title}</TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {tool.description || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {tool.category || "عام"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      فتح <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(tool)}
                        className="glass"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(tool.id)}
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
            صفحة {currentPage} من {totalPages} ({tools.length} أداة)
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
