"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { ADMIN_EMAILS } from "@/lib/admins";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const adminStatus = ADMIN_EMAILS.includes(user.email || "");
      setIsAdmin(adminStatus);

      // Redirect non-admin users
      if (!adminStatus) {
        router.push("/");
      }
    } else if (!loading) {
      // Redirect unauthenticated users
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>يتم التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">حدث خطأ</h1>
          <p className="text-gray-300">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">الوصول مرفوض</h1>
          <p className="text-lg text-gray-300">
            الرجاء تسجيل الدخول لعرض هذه الصفحة.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">غير مصرح به</h1>
          <p className="text-lg text-gray-300">
            ليس لديك الصلاحية للوصول إلى لوحة التحكم.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-6">{children}</div>
      </main>
    </div>
  );
}
