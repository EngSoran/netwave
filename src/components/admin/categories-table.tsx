"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  usedFor: "services" | "tools" | "files" | "all";
  createdAt: Date;
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState({
    name: "",
    nameArabic: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    order: 0,
    usedFor: "all" as "services" | "tools" | "files" | "all",
  });
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "categories"), orderBy("order", "asc"))
      );
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Category[];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل التصنيفات",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setFormValues({
        name: category.name,
        nameArabic: category.nameArabic,
        description: category.description,
        icon: category.icon,
        color: category.color,
        order: category.order,
        usedFor: category.usedFor,
      });
    } else {
      setIsEditing(false);
      setCurrentCategory(null);
      setFormValues({
        name: "",
        nameArabic: "",
        description: "",
        icon: "",
        color: "#3B82F6",
        order: categories.length,
        usedFor: "all",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!formValues.nameArabic?.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم التصنيف بالعربية",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentCategory) {
        await updateDoc(doc(db, "categories", currentCategory.id), formValues);
        toast({ title: "نجاح", description: "تم تحديث التصنيف بنجاح" });
      } else {
        await addDoc(collection(db, "categories"), {
          ...formValues,
          createdAt: serverTimestamp(),
        });
        toast({ title: "نجاح", description: "تمت إضافة التصنيف بنجاح" });
      }
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({ title: "خطأ", description: "فشل حفظ التصنيف", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;

    try {
      await deleteDoc(doc(db, "categories", id));
      toast({ title: "نجاح", description: "تم حذف التصنيف بنجاح" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({ title: "خطأ", description: "فشل حذف التصنيف", variant: "destructive" });
    }
  };

  const getUsedForLabel = (usedFor: string) => {
    const labels: Record<string, string> = {
      all: "الكل",
      services: "الخدمات",
      tools: "الأدوات",
      files: "الملفات",
    };
    return labels[usedFor] || usedFor;
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass hover:bg-white/20" onClick={() => handleOpenDialog()}>
              <PlusCircle className="ml-2 h-4 w-4" /> إضافة تصنيف
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass">
            <DialogHeader>
              <DialogTitle>{isEditing ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "قم بتعديل تفاصيل التصنيف"
                  : "أضف تصنيفًا جديدًا لتنظيم المحتوى"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nameArabic" className="text-right">
                  الاسم (عربي) *
                </Label>
                <Input
                  id="nameArabic"
                  value={formValues.nameArabic}
                  onChange={(e) =>
                    setFormValues({ ...formValues, nameArabic: e.target.value })
                  }
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  الاسم (إنجليزي)
                </Label>
                <Input
                  id="name"
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  الوصف
                </Label>
                <Textarea
                  id="description"
                  value={formValues.description}
                  onChange={(e) =>
                    setFormValues({ ...formValues, description: e.target.value })
                  }
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  الأيقونة
                </Label>
                <Input
                  id="icon"
                  value={formValues.icon}
                  onChange={(e) => setFormValues({ ...formValues, icon: e.target.value })}
                  className="col-span-3 glass"
                  placeholder="📁"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  اللون
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={formValues.color}
                  onChange={(e) => setFormValues({ ...formValues, color: e.target.value })}
                  className="col-span-3 glass h-10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usedFor" className="text-right">
                  يُستخدم في
                </Label>
                <Select
                  value={formValues.usedFor}
                  onValueChange={(value) =>
                    setFormValues({
                      ...formValues,
                      usedFor: value as "services" | "tools" | "files" | "all",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3 glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="services">الخدمات</SelectItem>
                    <SelectItem value="tools">الأدوات</SelectItem>
                    <SelectItem value="files">الملفات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  الترتيب
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={formValues.order}
                  onChange={(e) =>
                    setFormValues({ ...formValues, order: Number(e.target.value) })
                  }
                  className="col-span-3 glass"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit" className="btn-primary" onClick={handleSaveChanges}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-white/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20">
              <TableHead>الأيقونة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>يُستخدم في</TableHead>
              <TableHead>الترتيب</TableHead>
              <TableHead className="text-left w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  لا توجد تصنيفات حالياً
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <TableRow key={category.id} className="border-b-white/20">
                  <TableCell>
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      {category.icon || "📁"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {category.nameArabic}
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getUsedForLabel(category.usedFor)}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{category.order}</TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white hover:bg-white/10"
                        >
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-400 hover:!text-red-400 focus:!text-red-400"
                        >
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            صفحة {currentPage} من {totalPages} ({categories.length} تصنيف)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="glass"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="glass"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
