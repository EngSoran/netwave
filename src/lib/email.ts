// Email notification service
// This can be integrated with Resend, SendGrid, or any email service

export interface BookingConfirmationData {
  name: string;
  email: string;
  service: string;
  bookingDate: Date;
  amount: number;
  transactionId: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
  try {
    // In a real application, this would call an API route that sends the email
    // For now, we'll create a placeholder that logs the email content

    const emailContent = {
      to: data.email,
      subject: 'تأكيد الحجز - NetWave',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; color: #333; }
            .details { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #667eea; }
            .value { color: #333; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .success-icon { font-size: 48px; color: #28a745; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>تم تأكيد حجزك بنجاح!</h1>
            </div>
            <div class="content">
              <p>عزيزي/عزيزتي <strong>${data.name}</strong>،</p>
              <p>نشكرك على حجز خدمتنا. تم استلام طلبك وتأكيد الدفع بنجاح.</p>

              <div class="details">
                <h3 style="margin-top: 0; color: #667eea;">تفاصيل الحجز</h3>
                <div class="detail-row">
                  <span class="label">الخدمة:</span>
                  <span class="value">${data.service}</span>
                </div>
                <div class="detail-row">
                  <span class="label">التاريخ المفضل:</span>
                  <span class="value">${new Date(data.bookingDate).toLocaleDateString('ar-IQ')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">المبلغ المدفوع:</span>
                  <span class="value">${data.amount.toLocaleString('ar-IQ')} دينار عراقي</span>
                </div>
                <div class="detail-row">
                  <span class="label">رقم المعاملة:</span>
                  <span class="value">${data.transactionId}</span>
                </div>
              </div>

              <p>سيتم التواصل معك قريباً من قبل فريقنا لتأكيد الموعد النهائي.</p>
              <p>إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.</p>
            </div>
            <div class="footer">
              <p><strong>NetWave</strong></p>
              <p>شكراً لاختيارك خدماتنا</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        تأكيد الحجز - NetWave

        عزيزي/عزيزتي ${data.name},

        نشكرك على حجز خدمتنا. تم استلام طلبك وتأكيد الدفع بنجاح.

        تفاصيل الحجز:
        - الخدمة: ${data.service}
        - التاريخ المفضل: ${new Date(data.bookingDate).toLocaleDateString('ar-IQ')}
        - المبلغ المدفوع: ${data.amount.toLocaleString('ar-IQ')} دينار عراقي
        - رقم المعاملة: ${data.transactionId}

        سيتم التواصل معك قريباً من قبل فريقنا لتأكيد الموعد النهائي.

        شكراً لاختيارك خدماتنا
        NetWave
      `
    };

    // Log the email (in production, this would actually send the email)
    console.log('📧 Email to be sent:', emailContent);

    // TODO: Integrate with actual email service
    // Example with Resend:
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailContent)
    // });
    // return response.ok;

    // For now, return true to simulate success
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Admin notification when new booking is received
export async function sendAdminNotification(data: BookingConfirmationData): Promise<boolean> {
  try {
    const adminEmail = 'engineersoran1@gmail.com'; // Get from env in production

    const emailContent = {
      to: adminEmail,
      subject: 'حجز جديد - NetWave',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; color: #333; }
            .details { background-color: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #f59e0b; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #fed7aa; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #ea580c; }
            .value { color: #333; }
            .alert-icon { font-size: 48px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="alert-icon">🔔</div>
              <h1>حجز جديد تم استلامه!</h1>
            </div>
            <div class="content">
              <p>لديك حجز جديد تم تأكيد دفعه:</p>

              <div class="details">
                <h3 style="margin-top: 0; color: #ea580c;">معلومات العميل</h3>
                <div class="detail-row">
                  <span class="label">الاسم:</span>
                  <span class="value">${data.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">البريد الإلكتروني:</span>
                  <span class="value">${data.email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">الخدمة:</span>
                  <span class="value">${data.service}</span>
                </div>
                <div class="detail-row">
                  <span class="label">التاريخ المفضل:</span>
                  <span class="value">${new Date(data.bookingDate).toLocaleDateString('ar-IQ')}</span>
                </div>
                <div class="detail-row">
                  <span class="label">المبلغ المدفوع:</span>
                  <span class="value">${data.amount.toLocaleString('ar-IQ')} دينار عراقي</span>
                </div>
                <div class="detail-row">
                  <span class="label">رقم المعاملة:</span>
                  <span class="value">${data.transactionId}</span>
                </div>
              </div>

              <p>يرجى التواصل مع العميل لتأكيد الموعد النهائي.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Admin notification:', emailContent);
    return true;

  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}
