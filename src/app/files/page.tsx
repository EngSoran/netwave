"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Lock, CheckCircle } from "lucide-react";
import { zaincashService } from "@/lib/zaincash";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

interface UserPurchase {
  fileId: string;
  purchasedAt: Date;
  transactionId: string;
}

export default function FilesPage() {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [files, setFiles] = useState<FileDownload[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingFileId, setProcessingFileId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
    if (user) {
      fetchUserPurchases();
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
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
        description: "فشل تحميل الملفات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "purchases"),
        // Note: You'll need to add a where clause if you have userId field
      );
      const snapshot = await getDocs(q);
      const purchasesData = snapshot.docs
        .filter((d) => d.data().userId === user?.uid)
        .map((d) => ({
          fileId: d.data().fileId,
          purchasedAt: d.data().purchasedAt?.toDate() || new Date(),
          transactionId: d.data().transactionId,
        })) as UserPurchase[];
      setPurchases(purchasesData);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handlePurchase = async (file: FileDownload) => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب عليك تسجيل الدخول أولاً لشراء الملفات.",
        variant: "destructive",
      });
      return;
    }

    setProcessingFileId(file.id);

    try {
      // Create ZainCash transaction
      const transaction = await zaincashService.createTransaction({
        amount: file.price,
        serviceType: `شراء ملف: ${file.title}`,
        orderId: `file_${file.id}_${Date.now()}`,
        redirectUrl: `${window.location.origin}/files/callback?file_id=${file.id}&user_id=${user.uid}`,
        production: false,
        lang: 'ar',
      });

      // Redirect to payment gateway
      toast({
        title: "جاري التحويل للدفع...",
        description: "سيتم تحويلك إلى صفحة الدفع الآمنة.",
      });

      setTimeout(() => {
        window.location.href = transaction.url;
      }, 1500);
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "خطأ",
        description: "فشل إنشاء عملية الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setProcessingFileId(null);
    }
  };

  const handleDownload = (file: FileDownload) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = file.fileUrl;
    link.download = file.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم بدء التحميل",
      description: `جاري تحميل ${file.fileName}`,
    });
  };

  const isPurchased = (fileId: string) => {
    return purchases.some((p) => p.fileId === fileId);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:py-16 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:py-16 md:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            تحميل الملفات
          </h1>
          <p className="text-lg text-gray-300">
            ملفات مفيدة جاهزة للتحميل بعد الدفع
          </p>
        </div>

        {files.length === 0 ? (
          <Card className="glass text-center py-12">
            <CardContent>
              <p className="text-gray-300 text-lg">لا توجد ملفات متاحة حالياً</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => {
              const purchased = isPurchased(file.id);
              const processing = processingFileId === file.id;

              return (
                <Card key={file.id} className="glass hover:scale-105 transition-transform">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl text-white">
                        {file.title}
                      </CardTitle>
                      {purchased && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <CardDescription className="text-gray-300">
                      {file.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>حجم الملف:</span>
                        <span>{file.fileSize}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>اسم الملف:</span>
                        <span className="truncate max-w-[180px]">{file.fileName}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {file.price.toLocaleString('ar-IQ')} IQD
                          </span>
                        </div>
                        {purchased ? (
                          <Button
                            onClick={() => handleDownload(file)}
                            className="btn-primary w-full"
                          >
                            <Download className="h-4 w-4 ml-2" />
                            تحميل الملف
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handlePurchase(file)}
                            disabled={processing || !user}
                            className="btn-primary w-full"
                          >
                            {processing ? (
                              "جاري المعالجة..."
                            ) : (
                              <>
                                <Lock className="h-4 w-4 ml-2" />
                                شراء وتحميل
                              </>
                            )}
                          </Button>
                        )}
                        {!user && !purchased && (
                          <p className="text-xs text-gray-400 text-center mt-2">
                            يجب تسجيل الدخول أولاً
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
