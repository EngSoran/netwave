"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Package,
  FolderTree,
  MessageSquareQuote,
  HelpCircle,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Wrench,
  Image,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "نظرة عامة",
    items: [
      {
        title: "لوحة التحكم",
        href: "/admin",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "إدارة المحتوى",
    items: [
      {
        title: "الصفحة الرئيسية",
        href: "/admin/home-page",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "الخدمات",
        href: "/admin/services",
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: "التصنيفات",
        href: "/admin/categories",
        icon: <FolderTree className="h-5 w-5" />,
      },
      {
        title: "الشهادات",
        href: "/admin/testimonials",
        icon: <MessageSquareQuote className="h-5 w-5" />,
      },
      {
        title: "الأسئلة الشائعة",
        href: "/admin/faqs",
        icon: <HelpCircle className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "الأعمال",
    items: [
      {
        title: "طلبات الحجز",
        href: "/admin/bookings",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "المشتريات والمدفوعات",
        href: "/admin/purchases",
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        title: "المستخدمون",
        href: "/admin/users",
        icon: <Users className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "الموارد",
    items: [
      {
        title: "الملفات",
        href: "/admin/files",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "الأدوات",
        href: "/admin/tools",
        icon: <Wrench className="h-5 w-5" />,
      },
      {
        title: "مكتبة الوسائط",
        href: "/admin/media",
        icon: <Image className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "الإعدادات",
    items: [
      {
        title: "إعدادات الموقع",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "glass border-l border-white/20 h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-bold text-white">لوحة التحكم</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-white/10"
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              collapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
