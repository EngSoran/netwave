"use client";

import { use, useEffect, useState } from "react";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Server } from "lucide-react";
import styles from "./page.module.css";

interface Service {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  aiHint: string;
  icon: JSX.Element;
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use() for Next.js 15
  const { slug } = use(params);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        // Optimized: Use Firestore query instead of fetching all
        const q = query(collection(db, "services"), where("slug", "==", slug));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setService({
            title: data.title || "",
            description: data.description || "",
            longDescription: data.longDescription || "",
            image: data.image || "https://placehold.co/600x400.png",
            aiHint: data.aiHint || "",
            icon: <Server className="h-10 w-10 text-primary" />,
          });
        } else {
          setService(null);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto py-12 px-4 md:py-24 md:px-6 text-center text-white">جاري التحميل...</div>;
  }
  if (!service) {
    return <div className="container mx-auto py-12 px-4 md:py-24 md:px-6 text-center text-red-400 text-2xl">الخدمة غير موجودة</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:py-24 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/#services" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="ml-2 h-4 w-4" /> العودة إلى الخدمات
        </Link>
        <Card className="glass overflow-hidden">
          <div className={styles.serviceImageContainer}>
            <img
              src={service.image}
              alt={service.title}
              className={styles.serviceImage}
              data-ai-hint={service.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <CardHeader className="text-center relative -mt-20">
            <div className="inline-block bg-white/10 rounded-full p-4 mb-4 mx-auto">
                {service.icon}
            </div>
            <CardTitle className="text-4xl font-bold font-headline text-white">{service.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-lg text-gray-300 leading-relaxed text-center mb-10">
                {service.longDescription}
            </p>
            <div className="text-center">
                <Button asChild size="lg" className="btn-primary">
                    <Link href="/booking">
                        احجز خدمة {service.title} الآن <ArrowLeft className="mr-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

