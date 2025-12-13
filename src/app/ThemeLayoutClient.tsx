"use client";
import AnimatedNetworkBackground from "@/components/AnimatedNetworkBackground";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export default function ThemeLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedNetworkBackground theme="glass" />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
