"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { zaincashService } from "@/lib/zaincash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download } from "lucide-react";
import Link from "next/link";

function FilePaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const [fileInfo, setFileInfo] = useState<{ title: string; fileUrl: string; fileName: string } | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const fileId = searchParams.get("file_id");
      const userId = searchParams.get("user_id");
      const transactionId = searchParams.get("id");
      const token = searchParams.get("token");

      if (!fileId || !userId || !transactionId) {
        setStatus("failed");
        setMessage("معلومات الدفع غير مكتملة.");
        return;
      }

      try {
        // Verify payment with ZainCash
        const paymentStatus = await zaincashService.verifyTransaction(transactionId, token || "");

        if (paymentStatus.status === "success") {
          // Get file info
          const fileRef = doc(db, "files", fileId);
          const fileDoc = await getDoc(fileRef);

          if (!fileDoc.exists()) {
            setStatus("failed");
            setMessage("لم يتم العثور على الملف.");
            return;
          }

          const fileData = fileDoc.data();

          // Record purchase
          await addDoc(collection(db, "purchases"), {
            fileId: fileId,
            userId: userId,
            transactionId: transactionId,
            amount: fileData.price || 0,
            purchasedAt: new Date(),
            status: "completed",
          });

          setFileInfo({
            title: fileData.title,
            fileUrl: fileData.fileUrl,
            fileName: fileData.fileName,
          });

          setStatus("success");
          setMessage("تم الدفع بنجاح! يمكنك الآن تحميل الملف.");
        } else {
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

  const handleDownload = () => {
    if (!fileInfo) return;

    const link = document.createElement('a');
    link.href = fileInfo.fileUrl;
    link.download = fileInfo.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {status === "success" && fileInfo && (
            <div className="space-y-3">
              <div className="glass p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-400 mb-1">الملف:</p>
                <p className="text-white font-semibold">{fileInfo.title}</p>
              </div>
              <Button onClick={handleDownload} className="btn-primary w-full">
                <Download className="h-4 w-4 ml-2" />
                تحميل الملف الآن
              </Button>
              <Button asChild variant="outline" className="glass w-full">
                <Link href="/files">العودة إلى الملفات</Link>
              </Button>
            </div>
          )}
          {status === "failed" && (
            <div className="space-y-3">
              <Button asChild className="btn-primary w-full">
                <Link href="/files">حاول مرة أخرى</Link>
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

export default function FilePaymentCallbackPage() {
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
      <FilePaymentCallbackContent />
    </Suspense>
  );
}
