import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/20 mt-12">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <p className="text-sm text-gray-300 text-center md:text-left">
            © {new Date().getFullYear()} NetWeave. جميع الحقوق محفوظة.
          </p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="text-sm hover:underline text-gray-300 hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-sm hover:underline text-gray-300 hover:text-white transition-colors">شروط الخدمة</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
