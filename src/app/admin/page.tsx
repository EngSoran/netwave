
"use client";

import { DashboardOverview } from "@/components/admin/dashboard-overview";

export default function AdminDashboard() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          لوحة التحكم
        </h1>
        <p className="text-gray-300">نظرة عامة على نشاطات الموقع والإحصائيات.</p>
      </div>
      <DashboardOverview />
    </div>
  );
}
