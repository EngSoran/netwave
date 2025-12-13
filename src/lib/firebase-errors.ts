import { FirebaseError } from "firebase/app";

export function getFirebaseErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  }

  const errorMessages: Record<string, string> = {
    // Auth errors
    "auth/user-not-found": "لم يتم العثور على المستخدم.",
    "auth/wrong-password": "كلمة المرور غير صحيحة.",
    "auth/email-already-in-use": "البريد الإلكتروني مستخدم بالفعل.",
    "auth/weak-password": "كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل.",
    "auth/invalid-email": "البريد الإلكتروني غير صالح.",
    "auth/user-disabled": "تم تعطيل هذا الحساب.",
    "auth/operation-not-allowed": "العملية غير مسموح بها.",
    "auth/account-exists-with-different-credential": "يوجد حساب بنفس البريد الإلكتروني مع بيانات اعتماد مختلفة.",
    "auth/invalid-credential": "بيانات الاعتماد غير صالحة.",
    "auth/invalid-verification-code": "رمز التحقق غير صالح.",
    "auth/invalid-verification-id": "معرف التحقق غير صالح.",
    "auth/missing-verification-code": "رمز التحقق مفقود.",
    "auth/missing-verification-id": "معرف التحقق مفقود.",
    "auth/code-expired": "انتهت صلاحية الرمز.",
    "auth/requires-recent-login": "يتطلب تسجيل دخول حديث.",
    "auth/too-many-requests": "تم إرسال طلبات كثيرة جداً. يرجى المحاولة لاحقاً.",
    "auth/network-request-failed": "فشل الاتصال بالشبكة. تحقق من اتصال الإنترنت.",
    "auth/popup-closed-by-user": "تم إغلاق النافذة المنبثقة من قبل المستخدم.",
    "auth/cancelled-popup-request": "تم إلغاء طلب النافذة المنبثقة.",
    "auth/popup-blocked": "تم حظر النافذة المنبثقة من قبل المتصفح.",
    "auth/unauthorized-domain": "النطاق غير مصرح به.",

    // Firestore errors
    "permission-denied": "ليس لديك صلاحية للقيام بهذا الإجراء.",
    "not-found": "المستند غير موجود.",
    "already-exists": "المستند موجود بالفعل.",
    "resource-exhausted": "تم تجاوز الحد المسموح به. يرجى المحاولة لاحقاً.",
    "failed-precondition": "فشل الشرط المسبق للعملية.",
    "aborted": "تم إلغاء العملية بسبب تعارض.",
    "out-of-range": "القيمة خارج النطاق المسموح.",
    "unimplemented": "العملية غير مدعومة.",
    "internal": "حدث خطأ داخلي. يرجى المحاولة لاحقاً.",
    "unavailable": "الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.",
    "data-loss": "حدث فقدان للبيانات.",
    "unauthenticated": "يجب تسجيل الدخول أولاً.",
    "deadline-exceeded": "انتهت مهلة العملية.",
    "cancelled": "تم إلغاء العملية.",
    "invalid-argument": "المعامل غير صالح.",

    // Storage errors
    "storage/unauthorized": "ليس لديك صلاحية الوصول إلى هذا المورد.",
    "storage/canceled": "تم إلغاء العملية من قبل المستخدم.",
    "storage/unknown": "حدث خطأ غير معروف.",
    "storage/object-not-found": "الملف غير موجود.",
    "storage/bucket-not-found": "المجلد غير موجود.",
    "storage/project-not-found": "المشروع غير موجود.",
    "storage/quota-exceeded": "تم تجاوز حصة التخزين.",
    "storage/unauthenticated": "يجب تسجيل الدخول للوصول إلى التخزين.",
    "storage/retry-limit-exceeded": "تم تجاوز حد المحاولات.",
    "storage/invalid-checksum": "الملف تالف أو غير صالح.",
    "storage/invalid-event-name": "اسم الحدث غير صالح.",
    "storage/invalid-url": "رابط URL غير صالح.",
    "storage/invalid-argument": "المعامل غير صالح.",
    "storage/no-default-bucket": "لا يوجد مجلد افتراضي.",
    "storage/cannot-slice-blob": "الملف منتهي الصلاحية.",
    "storage/server-file-wrong-size": "حجم الملف غير متطابق.",
  };

  return errorMessages[error.code] || `حدث خطأ: ${error.message}`;
}
