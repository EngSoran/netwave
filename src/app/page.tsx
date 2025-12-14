"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Server } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [services, setServices] = useState<Array<{
    icon: JSX.Element;
    title: string;
    slug: string;
    description: string;
    longDescription: string;
    image: string;
    aiHint: string;
    id: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "services"));
        const dbServices = snapshot.docs.map(doc => {
          const data = doc.data();
          // Map Firestore data to static structure, fallback to empty string if missing
          return {
            icon: <Server className="h-10 w-10 text-primary" />, // fallback icon
            title: data.title || data.name || "",
            slug: data.slug || doc.id,
            description: data.description || "",
            longDescription: data.longDescription || "",
            image: data.image || "",
            aiHint: data.aiHint || "",
            id: doc.id
          };
        });
        setServices(dbServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="flex-1">
      <section className="relative w-full pt-20 pb-12 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white text-shadow-lg">
              أبني شبكتك مع الافضل
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
              توفر NetWeave حلول شبكات متطورة، من الأمان القوي إلى الاتصال السلس، مصممة للارتقاء ببنيتك التحتية.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="btn-primary w-full sm:w-auto">
                <Link href="/booking">
                  احجز استشارة <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto glass">
                <a href="https://wa.me/9647716295191" target="_blank" rel="noopener noreferrer">
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass w-full sm:w-auto">
                <Link href="#services">اعرف المزيد</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-primary font-semibold text-sm">ماذا نقدم</span>
            </div>
            <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl md:text-5xl text-white mb-4">
              خدماتنا <span className="text-primary">المتميزة</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              مجموعة شاملة من الخدمات لإدارة وتأمين وتحسين شبكتك بأحدث التقنيات والمعايير العالمية.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="glass flex flex-col text-center items-center p-6 h-full">
                    <CardHeader className="p-0 w-full">
                      <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                    </CardHeader>
                    <CardContent className="pt-4 w-full">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              services.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`} className="block hover:no-underline group">
                  <Card className="glass flex flex-col text-center items-center p-8 h-full hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-primary/50">
                    <CardHeader className="p-0">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-full p-6 mb-6 inline-block group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/30">
                        <Server className="h-12 w-12 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-2xl text-white mb-2 group-hover:text-primary transition-colors">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-gray-300 text-base leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

       <section className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="glass border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
              <span className="text-primary font-semibold text-sm">ابدأ الآن</span>
            </div>
            <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
              هل أنت مستعد لترقية <span className="text-primary">شبكتك؟</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              خبراؤنا هنا لمساعدتك في تصميم وتنفيذ حل الشبكة المثالي لعملك. دعنا نتحدث عن احتياجاتك ونبني شبكة قوية وآمنة.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="btn-primary w-full sm:w-auto shadow-lg shadow-primary/30">
                <Link href="/booking">
                  احجز استشارة مجانية <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
               <Button variant="outline" size="lg" asChild className="glass w-full sm:w-auto border-primary/30 hover:bg-primary/10 flex flex-col items-center py-6">
                <a href="https://wa.me/9647716295191" target="_blank" rel="noopener noreferrer">
                  <span>تواصل مباشر - واتساب</span>
                  <span className="text-xs text-gray-400 mt-1">(الرد حسب التفرغ)</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
