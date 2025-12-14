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
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
              <Button asChild size="lg" className="btn-primary w-full sm:w-auto min-h-[56px]">
                <Link href="/booking">
                  احجز استشارة <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full sm:w-auto glass min-h-[56px]">
                <a href="https://wa.me/9647716295191" target="_blank" rel="noopener noreferrer">
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="glass w-full sm:w-auto min-h-[56px]">
                <Link href="#services">اعرف المزيد</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl md:text-5xl text-white mb-4">خدماتنا</h2>
            <p className="text-base md:text-lg text-gray-300 px-4">
              مجموعة شاملة من الخدمات لإدارة وتأمين وتحسين شبكتك.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
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
                  <Card className="glass flex flex-col text-center items-center p-6 md:p-8 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/5 hover:border-white/20">
                    <CardHeader className="p-0 w-full">
                      <div className="bg-white/10 rounded-full p-5 mb-5 inline-block group-hover:bg-white/15 transition-colors duration-300">
                        <Server className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-xl md:text-2xl text-white px-2">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 w-full">
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed px-2">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4 text-center lg:text-right">
              <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight sm:text-4xl text-white px-2">هل أنت مستعد لترقية شبكتك؟</h2>
              <p className="text-base md:text-lg text-gray-300 px-4 lg:px-0">
                خبراؤنا هنا لمساعدتك في تصميم وتنفيذ حل الشبكة المثالي لعملك. دعنا نتحدث عن احتياجاتك.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 pt-4 px-4 lg:px-0">
                <Button asChild size="lg" className="btn-primary w-full sm:w-auto min-h-[56px]">
                  <Link href="/booking">
                    ابدأ الآن
                  </Link>
                </Button>
                 <Button variant="outline" size="lg" asChild className="glass w-full sm:w-auto min-h-[56px]">
                  <a href="https://wa.me/9647716295191" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center">
                    <span>تواصل واتساب</span>
                    <span className="text-xs text-gray-400">(الرد حسب التفرغ)</span>
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              {/* Add your image or component here, or remove this line if not needed */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
