"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

interface SiteSettings {
  // Contact Information
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  telegramUsername: string;
  address: string;

  // Social Media
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;

  // Business Info
  companyName: string;
  companyNameArabic: string;
  tagline: string;
  businessHours: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Features Toggle
  enableBookings: boolean;
  enablePayments: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  contactEmail: "info@netweave.com",
  contactPhone: "+964 771 629 5191",
  whatsappNumber: "009647716295191",
  telegramUsername: "yourusername",
  address: "العراق",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  companyName: "NetWeave",
  companyNameArabic: "نت ويف",
  tagline: "حلول شبكات احترافية",
  businessHours: "السبت - الخميس: 9:00 صباحاً - 5:00 مساءً",
  metaTitle: "NetWeave - حلول شبكات احترافية",
  metaDescription: "توفر NetWeave حلول شبكات متطورة، من الأمان القوي إلى الاتصال السلس",
  metaKeywords: "شبكات, أمان, برمجة, خدمات تقنية",
  enableBookings: true,
  enablePayments: true,
  maintenanceMode: false,
};

export function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "siteSettings", "global");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() } as SiteSettings);
      }
    } catch (error) {
      console.error("Error loading site settings:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "siteSettings", "global");

      await setDoc(
        docRef,
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ الإعدادات",
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
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass">
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="social">وسائل التواصل</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="features">الميزات</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">معلومات الاتصال</CardTitle>
              <CardDescription>معلومات التواصل مع الشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">اسم الشركة (عربي)</Label>
                  <Input
                    value={settings.companyNameArabic}
                    onChange={(e) =>
                      setSettings({ ...settings, companyNameArabic: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">اسم الشركة (English)</Label>
                  <Input
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="glass text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">الشعار</Label>
                <Input
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="glass text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">رقم الهاتف</Label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, contactPhone: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">رقم واتساب</Label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsappNumber: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">اسم المستخدم في تيليجرام</Label>
                  <Input
                    value={settings.telegramUsername}
                    onChange={(e) =>
                      setSettings({ ...settings, telegramUsername: e.target.value })
                    }
                    className="glass text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">العنوان</Label>
                <Input
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">ساعات العمل</Label>
                <Input
                  value={settings.businessHours}
                  onChange={(e) =>
                    setSettings({ ...settings, businessHours: e.target.value })
                  }
                  className="glass text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">وسائل التواصل الاجتماعي</CardTitle>
              <CardDescription>روابط حسابات التواصل الاجتماعي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">فيسبوك</Label>
                <Input
                  placeholder="https://facebook.com/yourpage"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">تويتر / X</Label>
                <Input
                  placeholder="https://twitter.com/yourhandle"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">إنستجرام</Label>
                <Input
                  placeholder="https://instagram.com/yourhandle"
                  value={settings.instagramUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, instagramUrl: e.target.value })
                  }
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">لينكد إن</Label>
                <Input
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="glass text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">إعدادات SEO</CardTitle>
              <CardDescription>تحسين محركات البحث والوصف التعريفي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">عنوان الموقع (Meta Title)</Label>
                <Input
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  className="glass text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">الوصف التعريفي (Meta Description)</Label>
                <Textarea
                  value={settings.metaDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, metaDescription: e.target.value })
                  }
                  className="glass text-white"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                <Input
                  value={settings.metaKeywords}
                  onChange={(e) =>
                    setSettings({ ...settings, metaKeywords: e.target.value })
                  }
                  className="glass text-white"
                  placeholder="شبكات, أمان, برمجة"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">تفعيل/إيقاف الميزات</CardTitle>
              <CardDescription>التحكم في ميزات الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">تفعيل نظام الحجز</Label>
                  <p className="text-sm text-gray-400">السماح للمستخدمين بحجز الخدمات</p>
                </div>
                <Switch
                  checked={settings.enableBookings}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableBookings: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">تفعيل نظام الدفع</Label>
                  <p className="text-sm text-gray-400">السماح بالدفع عبر ZainCash</p>
                </div>
                <Switch
                  checked={settings.enablePayments}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enablePayments: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">وضع الصيانة</Label>
                  <p className="text-sm text-gray-400">
                    إيقاف الموقع مؤقتاً للصيانة (خطر!)
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={loadSettings} className="glass">
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
