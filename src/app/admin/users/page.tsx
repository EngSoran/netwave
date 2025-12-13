"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إدارة المستخدمين
        </h1>
        <p className="text-gray-300">عرض جميع المستخدمين المسجلين ونشاطاتهم.</p>
      </div>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">المستخدمون</CardTitle>
          <CardDescription>قائمة بجميع المستخدمين وإحصائياتهم</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
