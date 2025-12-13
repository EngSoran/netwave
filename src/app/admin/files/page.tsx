"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilesTable } from "@/components/admin/files-table";

export default function AdminFilesPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة الملفات
        </h1>
        <p className="text-gray-300">إضافة أو تعديل أو إزالة الملفات المدفوعة.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">الملفات</CardTitle>
          <CardDescription>قائمة بجميع الملفات المتاحة للشراء</CardDescription>
        </CardHeader>
        <CardContent>
          <FilesTable />
        </CardContent>
      </Card>
    </div>
  );
}
