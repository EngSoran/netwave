import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-24 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl text-white mb-4">
          سياسة الخصوصية
        </h1>
        <p className="text-lg text-gray-300">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </p>
      </div>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">المقدمة</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            نحن في NetWeave نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام خدماتنا.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">المعلومات التي نجمعها</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">1. المعلومات الشخصية</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>الاسم الكامل</li>
              <li>عنوان البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>معلومات حساب Google (عند تسجيل الدخول)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2">2. معلومات الاستخدام</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>عنوان IP والموقع الجغرافي</li>
              <li>نوع المتصفح ونظام التشغيل</li>
              <li>الصفحات التي تزورها والوقت المستغرق</li>
              <li>سجلات الحجوزات والمعاملات</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2">3. معلومات الدفع</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>معلومات المعاملات عبر ZainCash</li>
              <li>رقم المعاملة وحالة الدفع</li>
              <li>المبلغ المدفوع وتاريخ الدفع</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">كيفية استخدام المعلومات</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>تقديم وتحسين خدماتنا</li>
            <li>معالجة الحجوزات والمدفوعات</li>
            <li>إرسال إشعارات وتحديثات حول خدماتك</li>
            <li>الرد على استفساراتك وتقديم الدعم الفني</li>
            <li>تحليل استخدام الموقع وتحسين تجربة المستخدم</li>
            <li>منع الاحتيال وضمان أمان المنصة</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">حماية البيانات</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            نتخذ تدابير أمنية صارمة لحماية معلوماتك الشخصية:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>تشفير البيانات باستخدام SSL/TLS</li>
            <li>تخزين آمن عبر Firebase و Google Cloud</li>
            <li>مصادقة ثنائية العامل</li>
            <li>مراقبة مستمرة للأنشطة المشبوهة</li>
            <li>صلاحيات محدودة للوصول إلى البيانات</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">مشاركة المعلومات</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>ZainCash لمعالجة المدفوعات (بيانات الدفع فقط)</li>
            <li>Google Firebase لتخزين البيانات بشكل آمن</li>
            <li>عند الحاجة القانونية أو بأمر من السلطات</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">حقوقك</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>لديك الحق في:</p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>الوصول إلى بياناتك الشخصية</li>
            <li>تصحيح أو تحديث معلوماتك</li>
            <li>حذف حسابك وبياناتك</li>
            <li>الاعتراض على معالجة بياناتك</li>
            <li>طلب نسخة من بياناتك</li>
          </ul>
          <p className="text-white font-semibold mt-4">
            للاستفسارات حول خصوصيتك، يرجى التواصل معنا عبر البريد الإلكتروني.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">ملفات تعريف الارتباط (Cookies)</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>حفظ تفضيلاتك وإعداداتك</li>
            <li>تحليل حركة المرور على الموقع</li>
            <li>الحفاظ على جلسة تسجيل الدخول</li>
          </ul>
          <p className="mt-4">
            يمكنك إدارة ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white text-2xl">التحديثات على سياسة الخصوصية</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار بارز على موقعنا. يُرجى مراجعة هذه الصفحة بانتظام للبقاء على اطلاع بأحدث التحديثات.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
