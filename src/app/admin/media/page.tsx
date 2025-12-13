"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaLibrary } from "@/components/admin/media-library";

export default function AdminMediaPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          مكتبة الوسائط
        </h1>
        <p className="text-gray-300">رفع وإدارة جميع صور ووسائط الموقع.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">الوسائط</CardTitle>
          <CardDescription>جميع الصور والملفات المرفوعة</CardDescription>
        </CardHeader>
        <CardContent>
          <MediaLibrary />
        </CardContent>
      </Card>
    </div>
  );
}
