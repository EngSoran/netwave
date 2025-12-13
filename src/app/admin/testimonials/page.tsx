"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsTable } from "@/components/admin/testimonials-table";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة الشهادات
        </h1>
        <p className="text-gray-300">إضافة وإدارة شهادات العملاء.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">شهادات العملاء</CardTitle>
          <CardDescription>قائمة بجميع شهادات وتقييمات العملاء</CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialsTable />
        </CardContent>
      </Card>
    </div>
  );
}
