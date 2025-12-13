import { BookingForm } from "@/components/booking-form";
import { Card } from "@/components/ui/card";

export default function BookingPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 md:py-24 md:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl text-white">احجز خدمة</h1>
        <p className="mt-4 text-lg text-gray-300">
          حدد موعدًا لاستشارة أو احجز خدمة مع خبراء الشبكات لدينا. املأ النموذج أدناه وسنتواصل معك.
        </p>
      </div>
      <Card className="mt-12 glass">
        <BookingForm />
      </Card>
    </div>
  );
}
