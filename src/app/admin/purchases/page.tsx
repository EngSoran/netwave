"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchasesTable } from "@/components/admin/purchases-table";

export default function AdminPurchasesPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          المشتريات والمدفوعات
        </h1>
        <p className="text-gray-300">عرض جميع المشتريات والمعاملات المالية.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">سجل المشتريات</CardTitle>
          <CardDescription>قائمة بجميع عمليات الشراء والدفع</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchasesTable />
        </CardContent>
      </Card>
    </div>
  );
}
