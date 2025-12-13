"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesTable } from "@/components/admin/services-table";

export default function AdminServicesPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة الخدمات
        </h1>
        <p className="text-gray-300">إضافة أو تعديل أو إزالة الخدمات التي تقدمها.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">الخدمات</CardTitle>
          <CardDescription>قائمة بجميع الخدمات المتاحة</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesTable />
        </CardContent>
      </Card>
    </div>
  );
}
