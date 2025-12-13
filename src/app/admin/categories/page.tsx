"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesTable } from "@/components/admin/categories-table";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة التصنيفات
        </h1>
        <p className="text-gray-300">تنظيم وتصنيف المحتوى في الموقع.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">التصنيفات</CardTitle>
          <CardDescription>
            إنشاء وتعديل التصنيفات لتنظيم الخدمات والأدوات والملفات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable />
        </CardContent>
      </Card>
    </div>
  );
}
