"use client";

import { SiteSettings } from "@/components/admin/site-settings";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          إعدادات الموقع
        </h1>
        <p className="text-gray-300">
          إدارة جميع إعدادات الموقع من مكان واحد.
        </p>
      </div>
      <SiteSettings />
    </div>
  );
}
