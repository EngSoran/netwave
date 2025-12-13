
"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, doc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface BookingRequest {
  id: string;
  name: string;
  email: string;
  service: string;
  bookingDate: Timestamp | Date;
  status: "Pending" | "Confirmed" | "Completed" | "Canceled";
}

type Status = "Pending" | "Confirmed" | "Completed" | "Canceled";

const getStatusVariant = (status: Status): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "Confirmed":
            return "default";
        case "Completed":
            return "secondary";
        case "Canceled":
            return "destructive";
        case "Pending":
        default:
            return "outline";
    }
}

const getStatusText = (status: Status): string => {
    switch (status) {
        case "Confirmed": return "مؤكد";
        case "Completed": return "مكتمل";
        case "Canceled": return "ملغى";
        case "Pending": return "قيد الانتظار";
        default: return "قيد الانتظار";
    }
}

export function RequestsTable() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requestsData: BookingRequest[] = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() } as BookingRequest);
      });
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, status: Status) => {
    const requestDoc = doc(db, "bookings", id);
    try {
      await updateDoc(requestDoc, { status });
      toast({
        title: "نجاح",
        description: "تم تحديث حالة الطلب بنجاح.",
      });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border border-white/20">
      <Table>
        <TableHeader>
          <TableRow className="border-b-white/20">
            <TableHead>العميل</TableHead>
            <TableHead>الخدمة</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead className="text-left w-[100px]">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRequests.map((request) => (
            <TableRow key={request.id} className="border-b-white/20">
              <TableCell>
                <div className="font-medium">{request.name}</div>
                <div className="text-sm text-gray-300">{request.email}</div>
              </TableCell>
              <TableCell>{request.service}</TableCell>
              <TableCell>
                {format(
                  request.bookingDate instanceof Date
                    ? request.bookingDate
                    : (request.bookingDate as Timestamp).toDate(),
                  'yyyy-MM-dd'
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(request.status as Status)}>{getStatusText(request.status as Status)}</Badge>
              </TableCell>
              <TableCell className="text-left">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass">
                      <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, 'Confirmed')}>
                        تأكيد الطلب
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, 'Completed')}>
                        وضع علامة كمكتمل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleUpdateStatus(request.id, 'Canceled')} 
                        className="text-red-400 hover:!text-red-400 focus:!text-red-400">
                        إلغاء الطلب
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-300">
            صفحة {currentPage} من {totalPages} ({requests.length} طلب)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="glass"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="glass"
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
