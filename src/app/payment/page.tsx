"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zaincashService } from "@/lib/zaincash";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('pending');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const txId = searchParams.get('transaction_id');
    if (txId) {
      setTransactionId(txId);
      verifyPayment(txId);
    }
  }, [searchParams]);

  const verifyPayment = async (txId: string) => {
    setStatus('loading');
    try {
      const token = searchParams.get('token') || '';
      const result = await zaincashService.verifyTransaction(txId, token);

      if (result.status === 'success' || result.status === 'completed') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
    }
  };

  const handlePayment = async () => {
    setStatus('loading');

    try {
      const bookingId = searchParams.get('booking_id') || `BOOKING-${Date.now()}`;
      const amount = parseFloat(searchParams.get('amount') || '50000'); // Default 50,000 IQD

      const transaction = await zaincashService.createTransaction({
        amount: amount,
        serviceType: 'Network Services',
        orderId: bookingId,
        redirectUrl: `${window.location.origin}/payment?booking_id=${bookingId}`,
        production: false, // Set to true in production
        lang: 'ar',
      });

      // Redirect to ZainCash payment page
      window.location.href = transaction.url;
    } catch (error) {
      console.error('Payment initialization error:', error);
      setStatus('failed');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:py-16 md:px-6 min-h-screen flex items-center justify-center">
      <Card className="glass max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">الدفع عبر ZainCash</CardTitle>
          <CardDescription>
            {status === 'pending' && 'قم بالدفع لتأكيد حجزك'}
            {status === 'loading' && 'جاري معالجة الدفع...'}
            {status === 'success' && 'تم الدفع بنجاح!'}
            {status === 'failed' && 'فشلت عملية الدفع'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'pending' && (
            <>
              <div className="text-center space-y-4">
                <p className="text-gray-300">المبلغ: {searchParams.get('amount') || '50,000'} دينار عراقي</p>
                <p className="text-sm text-gray-400">سيتم تحويلك إلى صفحة الدفع الآمنة</p>
              </div>
              <Button onClick={handlePayment} className="w-full btn-primary" size="lg">
                الدفع الآن
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full glass"
              >
                إلغاء
              </Button>
            </>
          )}

          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-300">جاري معالجة الدفع...</p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">تم الدفع بنجاح!</p>
                <p className="text-gray-300 text-sm">رقم المعاملة: {transactionId}</p>
              </div>
              <Button onClick={() => router.push('/')} className="w-full btn-primary">
                العودة للصفحة الرئيسية
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="text-center py-8">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">فشلت عملية الدفع</p>
                <p className="text-gray-300 text-sm">يرجى المحاولة مرة أخرى أو الاتصال بالدعم</p>
              </div>
              <Button onClick={handlePayment} className="w-full btn-primary">
                إعادة المحاولة
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full glass"
              >
                إلغاء
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 px-4 md:py-16 md:px-6 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p>جاري التحميل...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
