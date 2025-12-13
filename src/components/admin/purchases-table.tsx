"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Purchase {
  id: string;
  userId: string;
  fileId: string;
  fileName?: string;
  userEmail?: string;
  userName?: string;
  amount: number;
  transactionId?: string;
  purchasedAt: Date;
  paymentStatus?: string;
}

type StatusFilter = "all" | "Completed" | "Pending" | "Failed";

export function PurchasesTable() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [purchases, statusFilter]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);

      // Fetch purchases
      const purchasesSnapshot = await getDocs(
        query(collection(db, "purchases"), orderBy("purchasedAt", "desc"))
      );

      const purchasesData: Purchase[] = [];
      let total = 0;
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      let monthlyTotal = 0;

      for (const purchaseDoc of purchasesSnapshot.docs) {
        const data = purchaseDoc.data();

        // Get file info
        let fileName = "Unknown File";
        try {
          const filesSnapshot = await getDocs(collection(db, "files"));
          const file = filesSnapshot.docs.find((doc) => doc.id === data.fileId);
          if (file) {
            fileName = file.data().title || file.data().fileName || "Unknown File";
          }
        } catch (error) {
          console.error("Error fetching file:", error);
        }

        // Get user info
        let userEmail = "Unknown";
        let userName = "Unknown User";
        try {
          const usersSnapshot = await getDocs(collection(db, "users"));
          const user = usersSnapshot.docs.find((doc) => doc.id === data.userId);
          if (user) {
            userEmail = user.data().email || "Unknown";
            userName = user.data().displayName || "Unknown User";
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }

        const purchaseDate = data.purchasedAt?.toDate() || new Date();
        const amount = data.amount || 0;

        purchasesData.push({
          id: purchaseDoc.id,
          userId: data.userId,
          fileId: data.fileId,
          fileName,
          userEmail,
          userName,
          amount,
          transactionId: data.transactionId,
          purchasedAt: purchaseDate,
          paymentStatus: "Completed", // Default for old purchases
        });

        total += amount;
        if (purchaseDate >= monthStart) {
          monthlyTotal += amount;
        }
      }

      setPurchases(purchasesData);
      setTotalRevenue(total);
      setMonthlyRevenue(monthlyTotal);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المشتريات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPurchases = () => {
    if (statusFilter === "all") {
      setFilteredPurchases(purchases);
    } else {
      setFilteredPurchases(
        purchases.filter((p) => p.paymentStatus === statusFilter)
      );
    }
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      "التاريخ",
      "المستخدم",
      "البريد الإلكتروني",
      "الملف",
      "المبلغ",
      "رقم المعاملة",
    ];

    const rows = filteredPurchases.map((p) => [
      p.purchasedAt.toLocaleDateString("ar-EG"),
      p.userName,
      p.userEmail,
      p.fileName,
      p.amount,
      p.transactionId || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `purchases_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "تم التصدير",
      description: "تم تصدير البيانات إلى CSV بنجاح",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              إجمالي الإيرادات
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalRevenue.toLocaleString("ar-IQ")} IQD
            </div>
            <p className="text-xs text-gray-400 mt-1">من جميع المشتريات</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              الإيرادات الشهرية
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {monthlyRevenue.toLocaleString("ar-IQ")} IQD
            </div>
            <p className="text-xs text-gray-400 mt-1">هذا الشهر</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="glass text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="Completed">مكتملة</SelectItem>
              <SelectItem value="Pending">قيد الانتظار</SelectItem>
              <SelectItem value="Failed">فاشلة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} variant="outline" className="glass">
          <Download className="h-4 w-4 ml-2" />
          تصدير إلى CSV
        </Button>
      </div>

      {/* Purchases Table */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12 glass rounded-lg">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <p className="text-white mb-2">لا توجد مشتريات</p>
          <p className="text-gray-400 text-sm">
            {statusFilter !== "all"
              ? "لا توجد مشتريات بهذه الحالة"
              : "لا توجد مشتريات حالياً"}
          </p>
        </div>
      ) : (
        <>
          <div className="glass rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">التاريخ</TableHead>
                  <TableHead className="text-gray-300">المستخدم</TableHead>
                  <TableHead className="text-gray-300">الملف</TableHead>
                  <TableHead className="text-gray-300">المبلغ</TableHead>
                  <TableHead className="text-gray-300">رقم المعاملة</TableHead>
                  <TableHead className="text-gray-300">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPurchases.map((purchase) => (
                  <TableRow key={purchase.id} className="border-gray-700">
                    <TableCell className="text-white">
                      {purchase.purchasedAt.toLocaleDateString("ar-EG")}
                      <br />
                      <span className="text-xs text-gray-400">
                        {purchase.purchasedAt.toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        <p className="font-medium">{purchase.userName}</p>
                        <p className="text-xs text-gray-400">{purchase.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{purchase.fileName}</TableCell>
                    <TableCell className="text-primary font-semibold">
                      {purchase.amount.toLocaleString("ar-IQ")} IQD
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs">
                      {purchase.transactionId || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">مكتمل</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-300">
                صفحة {currentPage} من {totalPages} ({filteredPurchases.length} مشترية)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="glass"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="glass"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
