"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  monthlyRevenue: number;
  totalUsers: number;
  totalServices: number;
  totalFiles: number;
}

interface RecentBooking {
  id: string;
  name: string;
  service: string;
  status: string;
  createdAt: Date;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    totalServices: 0,
    totalFiles: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current month start
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch bookings
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));
      const bookings = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(
        (b: any) => b.status === "Pending" || b.status === "AwaitingPayment"
      ).length;

      // Calculate monthly revenue from completed bookings
      const monthlyRevenue = bookings
        .filter((b: any) => {
          const createdAt = b.createdAt?.toDate?.() || new Date(0);
          return (
            createdAt >= monthStart &&
            b.paymentStatus === "paid"
          );
        })
        .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

      // Fetch services count
      const servicesSnapshot = await getDocs(collection(db, "services"));
      const totalServices = servicesSnapshot.size;

      // Fetch files count
      const filesSnapshot = await getDocs(collection(db, "files"));
      const totalFiles = filesSnapshot.size;

      // Fetch users count (if users collection exists)
      let totalUsers = 0;
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        totalUsers = usersSnapshot.size;
      } catch (error) {
        // Users collection might not exist yet
        console.log("Users collection not found");
      }

      // Get recent bookings (last 5)
      const recentBookingsData = bookings
        .sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5)
        .map((b: any) => ({
          id: b.id,
          name: b.name || "غير معروف",
          service: b.service || "غير محدد",
          status: b.status || "Pending",
          createdAt: b.createdAt?.toDate?.() || new Date(),
        }));

      setStats({
        totalBookings,
        pendingBookings,
        monthlyRevenue,
        totalUsers,
        totalServices,
        totalFiles,
      });
      setRecentBookings(recentBookingsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      Pending: { variant: "secondary", label: "قيد الانتظار" },
      AwaitingPayment: { variant: "secondary", label: "بانتظار الدفع" },
      Confirmed: { variant: "default", label: "مؤكد" },
      Completed: { variant: "default", label: "مكتمل" },
      Canceled: { variant: "destructive", label: "ملغي" },
    };

    const statusInfo = statusMap[status] || { variant: "secondary", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-white/20 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-white/20 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-white/20 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              إجمالي الحجوزات
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.pendingBookings} قيد الانتظار
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              الإيرادات الشهرية
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.monthlyRevenue.toLocaleString("ar-IQ")} IQD
            </div>
            <p className="text-xs text-gray-400 mt-1">
              <TrendingUp className="inline h-3 w-3 ml-1" />
              هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              الخدمات
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalServices}</div>
            <p className="text-xs text-gray-400 mt-1">خدمة نشطة</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              المستخدمون
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-gray-400 mt-1">مستخدم مسجل</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">الحجوزات الأخيرة</CardTitle>
              <CardDescription>آخر 5 طلبات حجز</CardDescription>
            </div>
            <Button asChild variant="outline" className="glass">
              <Link href="/admin/bookings">عرض الكل</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد حجوزات حالياً</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">الاسم</TableHead>
                  <TableHead className="text-gray-300">الخدمة</TableHead>
                  <TableHead className="text-gray-300">الحالة</TableHead>
                  <TableHead className="text-gray-300">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-white/20">
                    <TableCell className="font-medium text-white">
                      {booking.name}
                    </TableCell>
                    <TableCell className="text-gray-300">{booking.service}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      {booking.createdAt.toLocaleDateString("ar-EG")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">إضافة خدمة جديدة</CardTitle>
            <CardDescription>أضف خدمة جديدة لعرضها للعملاء</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full btn-primary">
              <Link href="/admin/services">إدارة الخدمات</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">مكتبة الوسائط</CardTitle>
            <CardDescription>رفع وإدارة الصور والملفات</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full btn-primary">
              <Link href="/admin/media">فتح المكتبة</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">إعدادات الموقع</CardTitle>
            <CardDescription>تحديث معلومات الموقع والإعدادات</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full btn-primary">
              <Link href="/admin/settings">الإعدادات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
