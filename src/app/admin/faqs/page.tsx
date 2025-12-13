"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQsTable } from "@/components/admin/faqs-table";

export default function AdminFAQsPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة الأسئلة الشائعة
        </h1>
        <p className="text-gray-300">إضافة وإدارة الأسئلة الشائعة للعملاء.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">الأسئلة الشائعة</CardTitle>
          <CardDescription>قائمة بجميع الأسئلة والأجوبة الشائعة</CardDescription>
        </CardHeader>
        <CardContent>
          <FAQsTable />
        </CardContent>
      </Card>
    </div>
  );
}
