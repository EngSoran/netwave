
"use client"

import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  aiHint: string;
  slug: string;
}

export function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    longDescription: "",
    image: "",
    aiHint: "",
    slug: ""
  });
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      const servicesData: Service[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        servicesData.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          image: data.image || "",
          aiHint: data.aiHint || "",
          slug: data.slug || doc.id
        });
      });
      setServices(servicesData);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenDialog = (service: Service | null = null) => {
    if (service) {
      setIsEditing(true);
      setCurrentService(service);
      setFormValues({
        title: service.title,
        description: service.description,
        longDescription: service.longDescription,
        image: service.image,
        aiHint: service.aiHint,
        slug: service.slug
      });
    } else {
      setIsEditing(false);
      setCurrentService(null);
      setFormValues({
        title: "",
        description: "",
        longDescription: "",
        image: "",
        aiHint: "",
        slug: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    // Enhanced validation
    if (!formValues.title?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال اسم الخدمة.", variant: "destructive" });
      return;
    }
    if (!formValues.slug?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال المعرف (slug).", variant: "destructive" });
      return;
    }
    if (!formValues.description?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال الوصف.", variant: "destructive" });
      return;
    }
    if (!formValues.longDescription?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال الوصف التفصيلي.", variant: "destructive" });
      return;
    }
    if (!formValues.image?.trim()) {
      toast({ title: "خطأ", description: "يجب إدخال رابط الصورة.", variant: "destructive" });
      return;
    }

    // Validate slug format (lowercase, no spaces, alphanumeric with hyphens)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formValues.slug)) {
      toast({
        title: "خطأ",
        description: "المعرف (slug) يجب أن يكون بأحرف صغيرة وأرقام وشرطات فقط (مثال: network-setup).",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format for image
    try {
      new URL(formValues.image);
    } catch {
      toast({ title: "خطأ", description: "رابط الصورة غير صالح. يرجى إدخال رابط URL صحيح.", variant: "destructive" });
      return;
    }

    try {
      if (isEditing && currentService) {
        // Update existing service
        const serviceDoc = doc(db, "services", currentService.id);
        await updateDoc(serviceDoc, { ...formValues });
        toast({ title: "نجاح", description: "تم تحديث الخدمة بنجاح." });
      } else {
        // Add new service
        await addDoc(collection(db, "services"), {
          ...formValues,
          createdAt: serverTimestamp(),
        });
        toast({ title: "نجاح", description: "تمت إضافة الخدمة بنجاح." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast({ title: "خطأ", description: getFirebaseErrorMessage(error), variant: "destructive" });
    }
  };
  
  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, "services", id));
      toast({ title: "نجاح", description: "تم حذف الخدمة بنجاح." });
    } catch (error) {
       console.error("Error deleting service:", error);
       toast({ title: "خطأ", description: getFirebaseErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="glass hover:bg-white/20" onClick={() => handleOpenDialog()}>
              <PlusCircle className="ml-2 h-4 w-4" /> إضافة خدمة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass">
            <DialogHeader>
              <DialogTitle>{isEditing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "قم بتعديل تفاصيل الخدمة أدناه." : "املأ التفاصيل للخدمة الجديدة التي تريد تقديمها."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">الاسم</Label>
                <Input id="title" value={formValues.title} onChange={(e) => setFormValues({...formValues, title: e.target.value})} className="col-span-3 glass" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">المعرف (slug)</Label>
                <Input id="slug" value={formValues.slug} onChange={(e) => setFormValues({...formValues, slug: e.target.value})} className="col-span-3 glass" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">الوصف</Label>
                <Textarea id="description" value={formValues.description} onChange={(e) => setFormValues({...formValues, description: e.target.value})} className="col-span-3 glass" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longDescription" className="text-right">وصف تفصيلي</Label>
                <Textarea id="longDescription" value={formValues.longDescription} onChange={(e) => setFormValues({...formValues, longDescription: e.target.value})} className="col-span-3 glass" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">رابط الصورة</Label>
                <Input id="image" value={formValues.image} onChange={(e) => setFormValues({...formValues, image: e.target.value})} className="col-span-3 glass" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="aiHint" className="text-right">AI Hint</Label>
                <Input id="aiHint" value={formValues.aiHint} onChange={(e) => setFormValues({...formValues, aiHint: e.target.value})} className="col-span-3 glass" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
              <Button type="submit" className="btn-primary" onClick={handleSaveChanges}>حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-white/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20">
              <TableHead>اسم الخدمة</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead className="text-left w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServices.map((service) => (
              <TableRow key={service.id} className="border-b-white/20">
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="text-gray-300">{service.description}</TableCell>
                <TableCell className="text-left">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenDialog(service)}>تعديل</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteService(service.id)} className="text-red-400 hover:!text-red-400 focus:!text-red-400">حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-300">
            صفحة {currentPage} من {totalPages} ({services.length} خدمة)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="glass"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
  )
}
