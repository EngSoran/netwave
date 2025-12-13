// ZainCash Payment Gateway Integration
// Documentation: https://docs.zaincash.iq/

export interface ZainCashConfig {
  merchantId: string;
  secret: string;
  msisdn: string;
  apiUrl: string;
}

export interface ZainCashPaymentRequest {
  amount: number;
  serviceType: string;
  orderId: string;
  redirectUrl: string;
  production: boolean;
  lang?: 'ar' | 'en';
}

export interface ZainCashPaymentResponse {
  id: string;
  status: string;
  url: string;
}

export class ZainCashService {
  private config: ZainCashConfig;

  constructor(config: ZainCashConfig) {
    this.config = config;
  }

  /**
   * Initialize a payment transaction
   */
  async createTransaction(request: ZainCashPaymentRequest): Promise<ZainCashPaymentResponse> {
    const payload = {
      amount: request.amount * 1000, // Convert to IQD fils
      serviceType: request.serviceType,
      msisdn: this.config.msisdn,
      orderId: request.orderId,
      redirectUrl: request.redirectUrl,
      iat: Date.now(),
      exp: Date.now() + 60 * 60 * 4 * 1000, // 4 hours expiry
      lang: request.lang || 'ar',
    };

    // DEMO MODE: If no merchant ID is configured, use demo mode
    if (!this.config.merchantId || this.config.merchantId === '') {
      console.warn('⚠️ ZainCash running in DEMO MODE - No real payment will be processed');
      return {
        id: `DEMO-${Date.now()}`,
        status: 'pending',
        url: `${request.redirectUrl}&transaction_id=DEMO-${Date.now()}&token=demo-token&demo=true`,
      };
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/transaction/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateToken(payload)}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`ZainCash API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        status: data.status,
        url: data.url || `${this.config.apiUrl}/transaction/pay?id=${data.id}`,
      };
    } catch (error) {
      console.error('ZainCash transaction error:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyTransaction(transactionId: string, token: string): Promise<{ status: string; data?: any }> {
    // DEMO MODE: Auto-approve demo transactions
    if (transactionId.startsWith('DEMO-') || token === 'demo-token') {
      console.warn('⚠️ ZainCash DEMO MODE - Auto-approving payment');
      return {
        status: 'success',
        data: {
          transactionId,
          status: 'completed',
          message: 'تم الدفع بنجاح (وضع تجريبي)',
        },
      };
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/transaction/get/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || this.config.secret}`,
        },
      });

      if (!response.ok) {
        throw new Error(`ZainCash verification error: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if payment was successful
      // ZainCash returns status like "success", "pending", "failed"
      return {
        status: data.status || 'failed',
        data: data,
      };
    } catch (error) {
      console.error('ZainCash verification error:', error);
      return {
        status: 'failed',
        data: error,
      };
    }
  }

  /**
   * Generate JWT token for ZainCash API
   * Note: In production, this should be done on the server-side
   */
  private generateToken(payload: any): string {
    // Helper function to support Unicode characters (Arabic text)
    const base64UrlEncode = (str: string): string => {
      // Convert string to UTF-8 bytes
      const utf8Bytes = new TextEncoder().encode(str);
      // Convert bytes to base64
      let binary = '';
      utf8Bytes.forEach(byte => binary += String.fromCharCode(byte));
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    // This is a simplified version. In production, use a proper JWT library
    // and handle this on the server-side for security
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64UrlEncode(JSON.stringify(payload));
    const signature = base64UrlEncode(`${header}.${body}.${this.config.secret}`);

    return `${header}.${body}.${signature}`;
  }
}

// Initialize ZainCash service
// NOTE: Store these in environment variables in production
export const zaincashConfig: ZainCashConfig = {
  merchantId: process.env.NEXT_PUBLIC_ZAINCASH_MERCHANT_ID || '',
  secret: process.env.ZAINCASH_SECRET || '',
  msisdn: process.env.NEXT_PUBLIC_ZAINCASH_MSISDN || '',
  apiUrl: process.env.NEXT_PUBLIC_ZAINCASH_API_URL || 'https://test.zaincash.iq',
};

export const zaincashService = new ZainCashService(zaincashConfig);
