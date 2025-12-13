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
import { Switch } from "@/components/ui/switch";
import { PlusCircle, MoreHorizontal, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: Date;
}

export function FAQsTable() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null);
  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
    category: "عام",
    order: 0,
    published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "faqs"), orderBy("order", "asc"))
      );
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as FAQ[];
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الأسئلة الشائعة",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (faq: FAQ | null = null) => {
    if (faq) {
      setIsEditing(true);
      setCurrentFAQ(faq);
      setFormValues({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        published: faq.published,
      });
    } else {
      setIsEditing(false);
      setCurrentFAQ(null);
      setFormValues({
        question: "",
        answer: "",
        category: "عام",
        order: faqs.length,
        published: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!formValues.question?.trim() || !formValues.answer?.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال السؤال والجواب",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentFAQ) {
        await updateDoc(doc(db, "faqs", currentFAQ.id), formValues);
        toast({ title: "نجاح", description: "تم تحديث السؤال بنجاح" });
      } else {
        await addDoc(collection(db, "faqs"), {
          ...formValues,
          createdAt: serverTimestamp(),
        });
        toast({ title: "نجاح", description: "تمت إضافة السؤال بنجاح" });
      }
      setIsDialogOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast({ title: "خطأ", description: "فشل حفظ السؤال", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;

    try {
      await deleteDoc(doc(db, "faqs", id));
      toast({ title: "نجاح", description: "تم حذف السؤال بنجاح" });
      fetchFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({ title: "خطأ", description: "فشل حذف السؤال", variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass hover:bg-white/20" onClick={() => handleOpenDialog()}>
              <PlusCircle className="ml-2 h-4 w-4" /> إضافة سؤال
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "تعديل السؤال" : "إضافة سؤال شائع جديد"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "قم بتعديل تفاصيل السؤال" : "أضف سؤالاً شائعاً جديداً"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  السؤال *
                </Label>
                <Input
                  id="question"
                  value={formValues.question}
                  onChange={(e) => setFormValues({ ...formValues, question: e.target.value })}
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  الجواب *
                </Label>
                <Textarea
                  id="answer"
                  value={formValues.answer}
                  onChange={(e) => setFormValues({ ...formValues, answer: e.target.value })}
                  className="col-span-3 glass"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  التصنيف
                </Label>
                <Input
                  id="category"
                  value={formValues.category}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                  className="col-span-3 glass"
                  placeholder="عام، خدمات، دفع، إلخ..."
                />
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
              <div className="flex items-center justify-between">
                <Label htmlFor="published">منشور</Label>
                <Switch
                  id="published"
                  checked={formValues.published}
                  onCheckedChange={(checked) =>
                    setFormValues({ ...formValues, published: checked })
                  }
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

      <div className="glass rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">السؤال</TableHead>
              <TableHead className="text-gray-300">الجواب</TableHead>
              <TableHead className="text-gray-300">التصنيف</TableHead>
              <TableHead className="text-gray-300">الترتيب</TableHead>
              <TableHead className="text-gray-300">الحالة</TableHead>
              <TableHead className="text-gray-300 text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  <HelpCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد أسئلة شائعة حالياً</p>
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id} className="border-gray-700">
                  <TableCell className="text-white font-medium max-w-xs">
                    {faq.question}
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-md truncate">
                    {faq.answer}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{faq.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{faq.order}</TableCell>
                  <TableCell>
                    {faq.published ? (
                      <Badge variant="default">منشور</Badge>
                    ) : (
                      <Badge variant="secondary">مسودة</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white hover:bg-white/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(faq)}>
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(faq.id)}
                          className="text-red-400"
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
    </>
  );
}
