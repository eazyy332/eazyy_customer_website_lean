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

interface ContactEmailData {
  email: string;
  firstName: string;
  lastName: string;
  subject: string;
  message: string;
}

async function callEmailFunction(functionName: string, payload: any) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration for email service');
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
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

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  return callEmailFunction('send-order-email', data);
}

export async function sendDiscrepancyNotificationEmail(data: DiscrepancyEmailData) {
  return callEmailFunction('send-discrepancy-email', data);
}

export async function sendQuoteNotificationEmail(data: QuoteEmailData) {
  return callEmailFunction('send-quote-email', data);
}

export async function processEmailQueue() {
  return callEmailFunction('process-email-queue', {});
}

export async function sendContactConfirmationEmail(data: ContactEmailData) {
  return callEmailFunction('send-contact-confirmation', data);
}