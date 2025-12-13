"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCTAText: string;
  heroCTALink: string;
  heroSecondaryCTAText: string;
  heroSecondaryCTALink: string;
  servicesSectionTitle: string;
  servicesSectionSubtitle: string;
  ctaSectionTitle: string;
  ctaSectionDescription: string;
  ctaSectionButtonText: string;
  ctaSectionButtonLink: string;
}

const defaultContent: HomePageContent = {
  heroTitle: "أبني شبكتك مع الافضل",
  heroSubtitle:
    "توفر NetWeave حلول شبكات متطورة، من الأمان القوي إلى الاتصال السلس، مصممة للارتقاء ببنيتك التحتية.",
  heroCTAText: "احجز استشارة",
  heroCTALink: "/booking",
  heroSecondaryCTAText: "اعرف المزيد",
  heroSecondaryCTALink: "#services",
  servicesSectionTitle: "خدماتنا",
  servicesSectionSubtitle: "مجموعة شاملة من الخدمات لإدارة وتأمين وتحسين شبكتك.",
  ctaSectionTitle: "هل أنت مستعد لترقية شبكتك؟",
  ctaSectionDescription:
    "خبراؤنا هنا لمساعدتك في تصميم وتنفيذ حل الشبكة المثالي لعملك. دعنا نتحدث عن احتياجاتك.",
  ctaSectionButtonText: "ابدأ الآن",
  ctaSectionButtonLink: "/booking",
};

export function HomePageEditor() {
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "homePageContent", "main");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContent({ ...defaultContent, ...docSnap.data() } as HomePageContent);
      }
    } catch (error) {
      console.error("Error loading home page content:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل محتوى الصفحة الرئيسية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "homePageContent", "main");

      await setDoc(
        docRef,
        {
          ...content,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: "تم الحفظ",
        description: "تم حفظ محتوى الصفحة الرئيسية بنجاح",
      });
    } catch (error) {
      console.error("Error saving home page content:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ المحتوى",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="hero">قسم البطل</TabsTrigger>
          <TabsTrigger value="services">قسم الخدمات</TabsTrigger>
          <TabsTrigger value="cta">قسم الدعوة للعمل</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">قسم البطل (Hero)</CardTitle>
              <CardDescription>العنوان الرئيسي والنص التعريفي في أعلى الصفحة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">العنوان الرئيسي</Label>
                <Input
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="glass text-white"
                  placeholder="أبني شبكتك مع الافضل"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">النص التعريفي</Label>
                <Textarea
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="glass text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">نص الزر الأساسي</Label>
                  <Input
                    value={content.heroCTAText}
                    onChange={(e) => setContent({ ...content, heroCTAText: e.target.value })}
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">رابط الزر الأساسي</Label>
                  <Input
                    value={content.heroCTALink}
                    onChange={(e) => setContent({ ...content, heroCTALink: e.target.value })}
                    className="glass text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">نص الزر الثانوي</Label>
                  <Input
                    value={content.heroSecondaryCTAText}
                    onChange={(e) =>
                      setContent({ ...content, heroSecondaryCTAText: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">رابط الزر الثانوي</Label>
                  <Input
                    value={content.heroSecondaryCTALink}
                    onChange={(e) =>
                      setContent({ ...content, heroSecondaryCTALink: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">قسم الخدمات</CardTitle>
              <CardDescription>العنوان والوصف لقسم الخدمات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">عنوان القسم</Label>
                <Input
                  value={content.servicesSectionTitle}
                  onChange={(e) =>
                    setContent({ ...content, servicesSectionTitle: e.target.value })
                  }
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">وصف القسم</Label>
                <Textarea
                  value={content.servicesSectionSubtitle}
                  onChange={(e) =>
                    setContent({ ...content, servicesSectionSubtitle: e.target.value })
                  }
                  className="glass text-white"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">قسم الدعوة للعمل (CTA)</CardTitle>
              <CardDescription>قسم تشجيع المستخدم على التواصل أو الحجز</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">عنوان القسم</Label>
                <Input
                  value={content.ctaSectionTitle}
                  onChange={(e) =>
                    setContent({ ...content, ctaSectionTitle: e.target.value })
                  }
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">وصف القسم</Label>
                <Textarea
                  value={content.ctaSectionDescription}
                  onChange={(e) =>
                    setContent({ ...content, ctaSectionDescription: e.target.value })
                  }
                  className="glass text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">نص الزر</Label>
                  <Input
                    value={content.ctaSectionButtonText}
                    onChange={(e) =>
                      setContent({ ...content, ctaSectionButtonText: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">رابط الزر</Label>
                  <Input
                    value={content.ctaSectionButtonLink}
                    onChange={(e) =>
                      setContent({ ...content, ctaSectionButtonLink: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={loadContent} className="glass">
          إعادة تعيين
        </Button>
        <Button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2 h-4 w-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
