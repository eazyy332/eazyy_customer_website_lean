import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface OrderEmailPayload {
  email: string
  firstName?: string
  orderNumber: string
  customerName: string
  totalAmount: number
  pickupDate?: string
  deliveryDate?: string
  address: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

const generateOrderEmailHTML = (data: OrderEmailPayload) => {
  const { firstName, orderNumber, customerName, totalAmount, pickupDate, deliveryDate, address, items } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - eazyy</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background-color: #f8fafc;
      color: #1f2937;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%);
      padding: 40px 32px;
      text-align: center;
      color: white;
    }
    .logo {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
      color: #111827;
    }
    .order-info {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .order-number {
      font-size: 24px;
      font-weight: 700;
      color: #1D62DB;
      margin-bottom: 8px;
    }
    .order-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 20px 0;
    }
    .detail-item {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .detail-value {
      font-weight: 600;
      color: #111827;
    }
    .items-section {
      margin: 24px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #111827;
    }
    .item {
      display: flex;
      justify-content: between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-name {
      flex: 1;
      font-weight: 500;
    }
    .item-quantity {
      color: #6b7280;
      margin: 0 16px;
    }
    .item-price {
      font-weight: 600;
      color: #1D62DB;
    }
    .total-section {
      background-color: #1D62DB;
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin: 24px 0;
    }
    .total-amount {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .total-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .next-steps {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .next-steps h3 {
      color: #0369a1;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .step-number {
      background-color: #1D62DB;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #1D62DB;
      color: white;
      padding: 16px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      margin: 16px 0;
      text-align: center;
    }
    .footer {
      background-color: #f8fafc;
      padding: 32px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
    }
    .social-links {
      margin: 16px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .content {
        padding: 24px 20px;
      }
      .order-details {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">eazyy</div>
      <p class="header-subtitle">Your laundry order is confirmed</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${firstName || customerName || 'there'},
      </div>
      
      <p>Thank you for choosing eazyy! Your laundry order has been successfully placed and we're excited to take care of your items.</p>
      
      <div class="order-info">
        <div class="order-number">#${orderNumber}</div>
        
        <div class="order-details">
          ${pickupDate ? `
          <div class="detail-item">
            <div class="detail-label">Pickup Date</div>
            <div class="detail-value">${new Date(pickupDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          ` : ''}
          
          ${deliveryDate ? `
          <div class="detail-item">
            <div class="detail-label">Delivery Date</div>
            <div class="detail-value">${new Date(deliveryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          ` : ''}
          
          <div class="detail-item">
            <div class="detail-label">Address</div>
            <div class="detail-value">${address}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">Items</div>
            <div class="detail-value">${items.length} item${items.length > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
      
      <div class="items-section">
        <h3 class="section-title">Order Items</h3>
        ${items.map(item => `
          <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-quantity">×${item.quantity}</div>
            <div class="item-price">€${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="total-section">
        <div class="total-amount">€${totalAmount.toFixed(2)}</div>
        <div class="total-label">Total Amount</div>
      </div>
      
      <div class="next-steps">
        <h3>What happens next?</h3>
        <div class="step">
          <div class="step-number">1</div>
          <div>We'll prepare for your scheduled pickup and send you a confirmation</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div>Our driver will collect your items at the scheduled time</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div>Your items will be professionally cleaned and prepared for delivery</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div>We'll deliver your fresh, clean items back to you</div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="https://eazyy.app/orders" class="cta-button">Track Your Order</a>
      </div>
      
      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        Questions? Reply to this email or contact us at <a href="mailto:hello@eazyy.com" style="color: #1D62DB;">hello@eazyy.com</a>
      </p>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        <strong>eazyy</strong> - Laundry pickup and delivery in 24–48h
      </div>
      <div class="footer-text">
        123 Clean Street, Amsterdam, Netherlands
      </div>
      <div class="social-links">
        <a href="#" class="social-link">Facebook</a>
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Help Center</a>
      </div>
      <div class="footer-text" style="margin-top: 16px;">
        <a href="https://eazyy.app/privacy" style="color: #6b7280;">Privacy Policy</a> | 
        <a href="https://eazyy.app/terms" style="color: #6b7280;">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const payload: OrderEmailPayload = await req.json()
    
    if (!payload.email || !payload.orderNumber) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, orderNumber" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const emailHTML = generateOrderEmailHTML(payload)
    
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer re_MYAcaj94_MynPQijaMi7BWxgxkNf3kYJp`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "eazyy <orders@eazyy.com>",
        to: [payload.email],
        subject: `Order Confirmation - eazyy Order #${payload.orderNumber}`,
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error("Resend API error:", errorText)
      throw new Error(`Resend API error: ${resendResponse.status}`)
    }

    const resendData = await resendResponse.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: resendData.id,
        message: "Order confirmation email sent successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error("Email sending error:", error)
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})