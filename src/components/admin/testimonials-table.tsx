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
import { PlusCircle, MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  customerName: string;
  customerTitle: string;
  customerImage?: string;
  rating: number;
  content: string;
  serviceName?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
}

export function TestimonialsTable() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [formValues, setFormValues] = useState({
    customerName: "",
    customerTitle: "",
    customerImage: "",
    rating: 5,
    content: "",
    serviceName: "",
    featured: false,
    published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
      );
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Testimonial[];
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الشهادات",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (testimonial: Testimonial | null = null) => {
    if (testimonial) {
      setIsEditing(true);
      setCurrentTestimonial(testimonial);
      setFormValues({
        customerName: testimonial.customerName,
        customerTitle: testimonial.customerTitle,
        customerImage: testimonial.customerImage || "",
        rating: testimonial.rating,
        content: testimonial.content,
        serviceName: testimonial.serviceName || "",
        featured: testimonial.featured,
        published: testimonial.published,
      });
    } else {
      setIsEditing(false);
      setCurrentTestimonial(null);
      setFormValues({
        customerName: "",
        customerTitle: "",
        customerImage: "",
        rating: 5,
        content: "",
        serviceName: "",
        featured: false,
        published: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!formValues.customerName?.trim() || !formValues.content?.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم العميل والمحتوى",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentTestimonial) {
        await updateDoc(doc(db, "testimonials", currentTestimonial.id), formValues);
        toast({ title: "نجاح", description: "تم تحديث الشهادة بنجاح" });
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...formValues,
          createdAt: serverTimestamp(),
        });
        toast({ title: "نجاح", description: "تمت إضافة الشهادة بنجاح" });
      }
      setIsDialogOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({ title: "خطأ", description: "فشل حفظ الشهادة", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;

    try {
      await deleteDoc(doc(db, "testimonials", id));
      toast({ title: "نجاح", description: "تم حذف الشهادة بنجاح" });
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({ title: "خطأ", description: "فشل حذف الشهادة", variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass hover:bg-white/20" onClick={() => handleOpenDialog()}>
              <PlusCircle className="ml-2 h-4 w-4" /> إضافة شهادة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "تعديل الشهادة" : "إضافة شهادة جديدة"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "قم بتعديل تفاصيل الشهادة" : "أضف شهادة عميل جديدة"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerName" className="text-right">
                  اسم العميل *
                </Label>
                <Input
                  id="customerName"
                  value={formValues.customerName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, customerName: e.target.value })
                  }
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerTitle" className="text-right">
                  المسمى الوظيفي
                </Label>
                <Input
                  id="customerTitle"
                  value={formValues.customerTitle}
                  onChange={(e) =>
                    setFormValues({ ...formValues, customerTitle: e.target.value })
                  }
                  className="col-span-3 glass"
                  placeholder="مدير تقني في شركة XYZ"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  التقييم
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formValues.rating}
                  onChange={(e) =>
                    setFormValues({ ...formValues, rating: Number(e.target.value) })
                  }
                  className="col-span-3 glass"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  المحتوى *
                </Label>
                <Textarea
                  id="content"
                  value={formValues.content}
                  onChange={(e) => setFormValues({ ...formValues, content: e.target.value })}
                  className="col-span-3 glass"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  اسم الخدمة
                </Label>
                <Input
                  id="serviceName"
                  value={formValues.serviceName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, serviceName: e.target.value })
                  }
                  className="col-span-3 glass"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">مميز</Label>
                <Switch
                  id="featured"
                  checked={formValues.featured}
                  onCheckedChange={(checked) =>
                    setFormValues({ ...formValues, featured: checked })
                  }
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
              <TableHead className="text-gray-300">العميل</TableHead>
              <TableHead className="text-gray-300">المحتوى</TableHead>
              <TableHead className="text-gray-300">التقييم</TableHead>
              <TableHead className="text-gray-300">الحالة</TableHead>
              <TableHead className="text-gray-300 text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  لا توجد شهادات حالياً
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="border-gray-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{testimonial.customerName}</p>
                      {testimonial.customerTitle && (
                        <p className="text-xs text-gray-400">{testimonial.customerTitle}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">
                    {testimonial.content}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {testimonial.published && (
                        <Badge variant="default" className="text-xs">
                          منشور
                        </Badge>
                      )}
                      {testimonial.featured && (
                        <Badge variant="secondary" className="text-xs">
                          مميز
                        </Badge>
                      )}
                      {!testimonial.published && (
                        <Badge variant="secondary" className="text-xs">
                          مسودة
                        </Badge>
                      )}
                    </div>
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
                        <DropdownMenuItem onClick={() => handleOpenDialog(testimonial)}>
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(testimonial.id)}
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
