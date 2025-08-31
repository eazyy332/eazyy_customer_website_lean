import { supabase } from './supabase';

interface OrderEmailData {
  email: string;
  firstName?: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  pickupDate?: string;
  deliveryDate?: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface DiscrepancyEmailData {
  email: string;
  firstName?: string;
  orderNumber: string;
  discrepancyItems: Array<{
    product_name: string;
    expected_quantity: number;
    actual_quantity: number;
    notes?: string;
  }>;
  facilityName: string;
  cta_url: string;
}

interface QuoteEmailData {
  email: string;
  firstName?: string;
  quoteId: string;
  itemName: string;
  quotedPrice: number;
  estimatedDays: number;
  facilityNotes?: string;
  cta_url: string;
}

export class EmailService {
  private static async callEmailFunction(functionName: string, payload: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error(`Email service error (${functionName}):`, error);
      throw error;
    }
  }

  static async sendOrderConfirmation(data: OrderEmailData) {
    return this.callEmailFunction('send-order-email', data);
  }

  static async sendDiscrepancyNotification(data: DiscrepancyEmailData) {
    return this.callEmailFunction('send-discrepancy-email', data);
  }

  static async sendQuoteNotification(data: QuoteEmailData) {
    return this.callEmailFunction('send-quote-email', data);
  }

  static async processEmailQueue() {
    return this.callEmailFunction('process-email-queue', {});
  }
}