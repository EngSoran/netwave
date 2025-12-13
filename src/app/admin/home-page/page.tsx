"use client";

import { HomePageEditor } from "@/components/admin/home-page-editor";

export default function AdminHomePageEditorPage() {
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
          تحرير الصفحة الرئيسية
        </h1>
        <p className="text-gray-300">تعديل محتوى الصفحة الرئيسية بدون الحاجة للتعديل في الكود.</p>
      </div>
      <HomePageEditor />
    </div>
  );
}
