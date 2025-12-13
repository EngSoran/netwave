"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestsTable } from "@/components/admin/requests-table";

export default function AdminBookingsPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          طلبات الحجز
        </h1>
        <p className="text-gray-300">عرض وإدارة جميع طلبات حجز المستخدمين.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">طلبات الحجز</CardTitle>
          <CardDescription>قائمة بجميع طلبات الحجز من المستخدمين</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsTable />
        </CardContent>
      </Card>
    </div>
  );
}
