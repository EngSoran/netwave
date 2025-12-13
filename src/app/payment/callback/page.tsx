"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { zaincashService } from "@/lib/zaincash";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processPayment = async () => {
      const bookingId = searchParams.get("booking_id");
      const transactionId = searchParams.get("transaction_id") || searchParams.get("id");
      const token = searchParams.get("token");

      if (!bookingId || !transactionId) {
        setStatus("failed");
        setMessage("معلومات الدفع غير مكتملة.");
        return;
      }

      try {
        // Verify payment with ZainCash
        const paymentStatus = await zaincashService.verifyTransaction(transactionId, token || "");

        if (paymentStatus.status === "success") {
          // Update booking status in Firebase
          const bookingRef = doc(db, "bookings", bookingId);
          const bookingDoc = await getDoc(bookingRef);

          if (!bookingDoc.exists()) {
            setStatus("failed");
            setMessage("لم يتم العثور على الحجز.");
            return;
          }

          const bookingData = bookingDoc.data();

          await updateDoc(bookingRef, {
            status: "Confirmed",
            paymentStatus: "paid",
            transactionId: transactionId,
            paidAt: new Date(),
          });

          // Send email confirmations
          try {
            await sendBookingConfirmation({
              name: bookingData.name,
              email: bookingData.email,
              service: bookingData.service,
              bookingDate: bookingData.bookingDate instanceof Date
                ? bookingData.bookingDate
                : bookingData.bookingDate?.toDate(),
              amount: bookingData.amount || 50000,
              transactionId: transactionId,
            });

            await sendAdminNotification({
              name: bookingData.name,
              email: bookingData.email,
              service: bookingData.service,
              bookingDate: bookingData.bookingDate instanceof Date
                ? bookingData.bookingDate
                : bookingData.bookingDate?.toDate(),
              amount: bookingData.amount || 50000,
              transactionId: transactionId,
            });
          } catch (emailError) {
            console.error("Error sending emails:", emailError);
            // Don't fail the payment process if email fails
          }

          setStatus("success");
          setMessage("تم الدفع بنجاح! تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.");
        } else {
          // Payment failed
          const bookingRef = doc(db, "bookings", bookingId);
          await updateDoc(bookingRef, {
            status: "Canceled",
            paymentStatus: "failed",
            transactionId: transactionId,
          });

          setStatus("failed");
          setMessage("فشل الدفع. يرجى المحاولة مرة أخرى.");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setStatus("failed");
        setMessage("حدث خطأ أثناء معالجة الدفع. يرجى الاتصال بالدعم.");
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4 md:py-24 md:px-6 min-h-screen flex items-center justify-center">
      <Card className="glass max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            )}
            {status === "failed" && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {status === "loading" && "جاري معالجة الدفع..."}
            {status === "success" && "تم الدفع بنجاح!"}
            {status === "failed" && "فشل الدفع"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-300 mb-6">{message}</p>
          {status === "success" && (
            <Button asChild className="btn-primary w-full">
              <Link href="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          )}
          {status === "failed" && (
            <div className="space-y-3">
              <Button asChild className="btn-primary w-full">
                <Link href="/booking">حاول مرة أخرى</Link>
              </Button>
              <Button asChild variant="outline" className="glass w-full">
                <Link href="/">العودة إلى الصفحة الرئيسية</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-12 px-4 md:py-16 md:px-6 min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <p>جاري التحميل...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
