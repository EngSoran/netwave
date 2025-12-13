"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolsTable } from "@/components/admin/tools-table";

export default function AdminToolsPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة الأدوات
        </h1>
        <p className="text-gray-300">إضافة أو تعديل أو إزالة الأدوات والروابط المفيدة.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">الأدوات</CardTitle>
          <CardDescription>قائمة بجميع الأدوات والروابط المفيدة</CardDescription>
        </CardHeader>
        <CardContent>
          <ToolsTable />
        </CardContent>
      </Card>
    </div>
  );
}
