import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-24 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl text-white mb-4">
          شروط الخدمة
        </h1>
        <p className="text-lg text-gray-300">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </p>
      </div>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">مرحباً بك في NetWeave</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            باستخدامك لموقع NetWeave وخدماته، فإنك توافق على الالتزام بشروط الخدمة هذه. يُرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">1. قبول الشروط</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا لم توافق على هذه الشروط، يُرجى عدم استخدام خدماتنا.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">2. الخدمات المقدمة</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>تقدم NetWeave الخدمات التالية:</p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>استشارات وحلول الشبكات للأفراد والشركات</li>
            <li>تصميم وتنفيذ البنية التحتية للشبكات</li>
            <li>الأمن السيبراني وحماية الشبكات</li>
            <li>الصيانة والدعم الفني</li>
            <li>توفير ملفات ومصادر تعليمية مدفوعة</li>
            <li>أدوات ومصادر مجانية للمجتمع التقني</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">3. التسجيل واستخدام الحساب</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">إنشاء الحساب</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>يجب أن تكون بعمر 18 عامًا أو أكثر لإنشاء حساب</li>
              <li>يجب تقديم معلومات دقيقة وكاملة</li>
              <li>أنت مسؤول عن الحفاظ على سرية حسابك</li>
              <li>يجب إبلاغنا فوراً بأي استخدام غير مصرح به لحسابك</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2 mt-4">الاستخدام المسموح</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>استخدام الخدمات للأغراض القانونية فقط</li>
              <li>احترام حقوق الملكية الفكرية</li>
              <li>عدم مشاركة معلومات الدخول مع الآخرين</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">4. الحجوزات والمدفوعات</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">الحجز</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>يجب دفع رسوم الحجز المطلوبة (50,000 دينار عراقي) عند تقديم الطلب</li>
              <li>الحجز يصبح نهائياً بعد إتمام الدفع بنجاح</li>
              <li>سنتواصل معك خلال 24-48 ساعة لتأكيد الموعد</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2 mt-4">المدفوعات</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>جميع المدفوعات تتم عبر ZainCash بشكل آمن</li>
              <li>الأسعار معروضة بالدينار العراقي (IQD)</li>
              <li>في حالة فشل الدفع، لن يتم تأكيد الحجز</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2 mt-4">سياسة الاسترداد</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>يمكن إلغاء الحجز واسترداد المبلغ كاملاً قبل 48 ساعة من الموعد</li>
              <li>الإلغاء قبل 24 ساعة من الموعد: استرداد 50٪</li>
              <li>لا يمكن استرداد المبلغ في حالة الإلغاء في نفس اليوم</li>
              <li>سيتم معالجة الاسترداد خلال 5-7 أيام عمل</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">5. الملفات والمحتوى الرقمي</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">الشراء والوصول</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>عند شراء ملف، تحصل على ترخيص استخدام شخصي غير قابل للنقل</li>
              <li>يمكنك تحميل الملف مباشرة بعد إتمام الدفع</li>
              <li>الوصول إلى الملفات المشتراة متاح من حسابك في أي وقت</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-2 mt-4">القيود</h3>
            <ul className="list-disc list-inside space-y-2 mr-4">
              <li>ممنوع إعادة البيع أو التوزيع أو المشاركة</li>
              <li>ممنوع نسخ أو تعديل المحتوى للاستخدام التجاري</li>
              <li>الاستخدام مقتصر على الأغراض الشخصية والتعليمية فقط</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">6. الملكية الفكرية</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            جميع المحتويات والمواد المعروضة على هذا الموقع، بما في ذلك النصوص والصور والشعارات والأكواد والتصاميم، هي ملكية حصرية لـ NetWeave ومحمية بموجب قوانين حقوق النشر والملكية الفكرية.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">7. السلوك المحظور</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>يُحظر عليك القيام بما يلي:</p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>استخدام الخدمة لأي غرض غير قانوني أو احتيالي</li>
            <li>محاولة اختراق أو تعطيل أمان الموقع</li>
            <li>رفع أو نقل فيروسات أو برامج ضارة</li>
            <li>انتحال هوية أشخاص أو كيانات أخرى</li>
            <li>إرسال رسائل مزعجة أو غير مرغوب فيها</li>
            <li>جمع معلومات المستخدمين الآخرين دون إذن</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">8. إخلاء المسؤولية</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            يتم توفير الخدمات "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نضمن أن الخدمة ستكون متاحة دائماً أو خالية من الأخطاء. نحن غير مسؤولين عن:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>أي انقطاع أو تأخير في الخدمة</li>
            <li>فقدان البيانات أو المعلومات</li>
            <li>أخطاء في المحتوى أو المعلومات المقدمة</li>
            <li>مشاكل ناتجة عن خدمات الطرف الثالث (مثل ZainCash)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">9. تحديد المسؤولية</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            في حدود ما يسمح به القانون، لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">10. إنهاء الخدمة</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت إذا:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-4">
            <li>انتهكت أي من شروط الخدمة هذه</li>
            <li>استخدمت الخدمة بطريقة احتيالية أو غير قانونية</li>
            <li>لم تدفع الرسوم المستحقة</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-8">
        <CardHeader>
          <CardTitle className="text-white text-2xl">11. التعديلات على الشروط</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على الموقع. استمرارك في استخدام الخدمة بعد التعديلات يعني موافقتك على الشروط الجديدة.
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white text-2xl">12. القانون الواجب التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-4">
          <p>
            تخضع هذه الشروط وتُفسر وفقاً لقوانين جمهورية العراق. أي نزاعات تنشأ عن استخدام هذه الخدمة ستُحل في المحاكم المختصة في العراق.
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 p-6 glass rounded-lg">
        <h2 className="text-white text-xl font-semibold mb-4">تواصل معنا</h2>
        <p className="text-gray-300">
          إذا كان لديك أي أسئلة حول شروط الخدمة، يُرجى الاتصال بنا عبر:
        </p>
        <ul className="text-gray-300 mt-4 space-y-2">
          <li>البريد الإلكتروني: support@netweave.com</li>
          <li>WhatsApp: +964 XXX XXX XXXX</li>
          <li>Telegram: @netweave_support</li>
        </ul>
      </div>
    </div>
  );
}
