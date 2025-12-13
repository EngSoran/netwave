
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { zaincashService } from "@/lib/zaincash";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CardContent } from "./ui/card";
import { services as staticServices } from "@/lib/services";

const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: "يجب أن يتكون الاسم من حرفين على الأقل.",
  }).max(100, {
    message: "الاسم طويل جداً.",
  }),
  email: z.string()
    .email({
      message: "الرجاء إدخال عنوان بريد إلكتروني صالح.",
    })
    .refine((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }, {
      message: "صيغة البريد الإلكتروني غير صحيحة.",
    }),
  phone: z.string()
    .min(10, {
      message: "رقم الهاتف يجب أن يكون على الأقل 10 أرقام.",
    })
    .max(15, {
      message: "رقم الهاتف طويل جداً.",
    })
    .refine((phone) => {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ''));
    }, {
      message: "صيغة رقم الهاتف غير صحيحة. يرجى إدخال رقم صالح (مثال: 07xxxxxxxxx أو +9647xxxxxxxxx).",
    }),
  service: z.string({
    required_error: "الرجاء اختيار خدمة.",
  }),
  bookingDate: z.date({
    required_error: "تاريخ الحجز مطلوب.",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // سعر الخدمة الافتراضي (يمكن تخصيصه حسب الخدمة)
  const SERVICE_PRICE = 50000; // 50,000 دينار عراقي

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: BookingFormValues) {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب عليك تسجيل الدخول أولاً لحجز خدمة.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // إنشاء طلب الحجز في Firebase أولاً
      const bookingRef = await addDoc(collection(db, "bookings"), {
        ...data,
        userId: user.uid,
        status: "AwaitingPayment", // في انتظار الدفع
        paymentStatus: "pending",
        amount: SERVICE_PRICE,
        createdAt: serverTimestamp(),
      });

      // إنشاء معاملة الدفع عبر ZainCash
      const transaction = await zaincashService.createTransaction({
        amount: SERVICE_PRICE,
        serviceType: `حجز خدمة: ${data.service}`,
        orderId: bookingRef.id,
        redirectUrl: `${window.location.origin}/payment/callback?booking_id=${bookingRef.id}`,
        production: false, // غيّر إلى true في الإنتاج
        lang: 'ar',
      });

      // توجيه المستخدم إلى صفحة الدفع
      toast({
        title: "جاري التحويل للدفع...",
        description: "سيتم تحويلك إلى صفحة الدفع الآمنة.",
      });

      // الانتقال إلى صفحة الدفع
      setTimeout(() => {
        window.location.href = transaction.url;
      }, 1500);

    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "خطأ",
        description: getFirebaseErrorMessage(error),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  const serviceNames = staticServices.map(s => s.title);

  return (
    <CardContent className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="جون دو" {...field} className="glass" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} className="glass" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="05xxxxxxxx" {...field} className="glass" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الخدمة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="اختر الخدمة التي تهتم بها" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    {serviceNames.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>التاريخ المفضل</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal glass",
                          !field.value && "text-gray-300"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>اختر تاريخًا</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() - 1))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  اختر تاريخًا مفضلاً لخدمتك أو استشارتك.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
}
