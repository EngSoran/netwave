
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Separator } from "../ui/separator";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import IpDetector from "@/components/IpDetector";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.586,44,31.016,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.74.45 3.48 1.34 5l-1.4 5.14 5.24-1.38c1.47.81 3.12 1.24 4.73 1.24h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.9-9.91-9.9zM17.13 15.45c-.17-.28-.62-1.03-.72-1.18s-.21-.23-.42-.23c-.21 0-.42.08-.63.42s-.84 1.03-1.03 1.23c-.19.21-.38.23-.7.08-.32-.15-1.34-.49-2.55-1.58-.95-.85-1.59-1.9-1.79-2.23s-.04-.28.04-.42c.08-.12.19-.32.28-.42s.12-.17.17-.28c.05-.12.03-.23-.03-.33s-.42-.5-.58-.68c-.15-.17-.3-.19-.42-.19h-.42c-.21 0-.5.23-.5.78s.5 2.33 1.5 3.33c1 1 2.33 2 4.33 2.5.5.15.8.19.95.12.19-.08.84-1.03.99-1.23.15-.2.25-.33.1-.61z"/>
    </svg>
)

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" {...props}>
        <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.28 1.4.24 1.2 1.18l-2.53 12.08c-.24 1.13-1.02 1.4-1.9.91L14.5 16l-3.3 3.17c-.38.37-.88.18-1.02-.32z"/>
    </svg>
)

const navLinks = [
  { href: "/#services", label: "الخدمات" },
  { href: "/files", label: "الملفات" },
  { href: "/tools", label: "الأدوات" },
  { href: "/booking", label: "احجز الآن" },
];

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-lg font-medium text-white/80 transition-colors hover:text-white"
          >
            الإدارة
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <IpDetector />
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر واتساب">
              <WhatsappIcon />
            </a>
          </Button>
           <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <a href="https://t.me/yourusername" target="_blank" rel="noopener noreferrer" aria-label="تواصل عبر تيليجرام">
                <TelegramIcon />
            </a>
          </Button>

          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt="صورة المستخدم" />
                      <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.displayName}</p>
                      <p className="text-xs leading-none text-gray-300">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="text-white hover:!bg-white/20">
                    <Link href="/admin">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-white hover:!bg-white/20">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn} className="glass hover:bg-white/20">
                <GoogleIcon className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">فتح قائمة التنقل</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass">
                <div className="p-4">
                  <Logo />
                </div>
                <nav className="grid gap-6 text-lg font-medium p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                   <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    الإدارة
                  </Link>
                  <Separator className="my-2 bg-white/20"/>
                  {user ? (
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                              <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt="صورة المستخدم" />
                              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{user.displayName}</p>
                            <p className="text-sm text-gray-300">{user.email}</p>
                          </div>
                        </div>
                        <Button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="w-full glass hover:bg-white/20">
                           <LogOut className="ml-2 h-4 w-4" />
                           تسجيل الخروج
                        </Button>
                     </div>
                  ) : (
                    <Button onClick={() => { handleSignIn(); setIsMobileMenuOpen(false); }} className="w-full glass hover:bg-white/20">
                      <GoogleIcon className="ml-2 h-4 w-4" />
                      تسجيل الدخول
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
