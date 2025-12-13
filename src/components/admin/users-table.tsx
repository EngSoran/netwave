"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, ChevronLeft, ChevronRight, User, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  totalBookings?: number;
  totalPurchases?: number;
  totalSpent?: number;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch users from the users collection
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData: UserData[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();

        // Count bookings for this user
        const bookingsSnapshot = await getDocs(
          query(collection(db, "bookings"), orderBy("createdAt", "desc"))
        );
        const userBookings = bookingsSnapshot.docs.filter(
          (doc) => doc.data().userId === userDoc.id
        );

        // Count purchases for this user
        const purchasesSnapshot = await getDocs(collection(db, "purchases"));
        const userPurchases = purchasesSnapshot.docs.filter(
          (doc) => doc.data().userId === userDoc.id
        );

        // Calculate total spent
        const totalSpent = userPurchases.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        );

        usersData.push({
          id: userDoc.id,
          email: userData.email || "",
          displayName: userData.displayName || "Unknown User",
          photoURL: userData.photoURL,
          createdAt: userData.createdAt?.toDate(),
          lastLoginAt: userData.lastLoginAt?.toDate(),
          totalBookings: userBookings.length,
          totalPurchases: userPurchases.length,
          totalSpent,
        });
      }

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="بحث بالاسم أو البريد الإلكتروني..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass text-white pr-10"
          />
        </div>
        <div className="text-sm text-gray-300">
          {filteredUsers.length} من {users.length} مستخدم
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 glass rounded-lg">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
          <p className="text-white mb-2">لا يوجد مستخدمون</p>
          <p className="text-gray-400 text-sm">
            {searchQuery
              ? "لم يتم العثور على نتائج. جرب تغيير البحث."
              : "لا يوجد مستخدمون مسجلون حالياً"}
          </p>
        </div>
      ) : (
        <>
          <div className="glass rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">المستخدم</TableHead>
                  <TableHead className="text-gray-300">البريد الإلكتروني</TableHead>
                  <TableHead className="text-gray-300">الحجوزات</TableHead>
                  <TableHead className="text-gray-300">المشتريات</TableHead>
                  <TableHead className="text-gray-300">إجمالي الإنفاق</TableHead>
                  <TableHead className="text-gray-300">تاريخ التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                          <AvatarFallback>
                            {user.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.displayName}</p>
                          {user.lastLoginAt && (
                            <p className="text-xs text-gray-400">
                              آخر دخول:{" "}
                              {user.lastLoginAt.toLocaleDateString("ar-EG", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.totalBookings || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.totalPurchases || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-primary font-semibold">
                      {(user.totalSpent || 0).toLocaleString("ar-IQ")} IQD
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {user.createdAt
                          ? user.createdAt.toLocaleDateString("ar-EG")
                          : "غير متوفر"}
                      </div>
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
                صفحة {currentPage} من {totalPages} ({filteredUsers.length} مستخدم)
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
