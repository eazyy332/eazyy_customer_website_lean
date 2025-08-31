import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface DiscrepancyEmailPayload {
  email: string
  firstName?: string
  orderNumber: string
  discrepancyItems: Array<{
    product_name: string
    expected_quantity: number
    actual_quantity: number
    notes?: string
  }>
  facilityName: string
  cta_url: string
}

const generateDiscrepancyEmailHTML = (data: DiscrepancyEmailPayload) => {
  const { firstName, orderNumber, discrepancyItems, facilityName, cta_url } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update Required - eazyy</title>
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
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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
    .alert-icon {
      width: 48px;
      height: 48px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
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
    .alert-box {
      background-color: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .alert-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
    }
    .alert-text {
      color: #92400e;
      margin: 0;
    }
    .order-number {
      font-size: 24px;
      font-weight: 700;
      color: #1D62DB;
      margin-bottom: 16px;
      text-align: center;
    }
    .discrepancy-item {
      background-color: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .item-name {
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .quantity-change {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .quantity-badge {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .arrow {
      color: #6b7280;
    }
    .cta-section {
      background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%);
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin: 32px 0;
    }
    .cta-title {
      color: white;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .cta-text {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 24px;
    }
    .cta-button {
      display: inline-block;
      background-color: white;
      color: #1D62DB;
      padding: 16px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-icon">⚠️</div>
      <div class="logo">eazyy</div>
      <p class="header-subtitle">Order update required</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${firstName || 'there'},
      </div>
      
      <div class="alert-box">
        <div class="alert-title">Extra Items Found</div>
        <p class="alert-text">
          Our team at ${facilityName} found some differences between what was ordered and what was received. Please review these items below.
        </p>
      </div>
      
      <div class="order-number">#${orderNumber}</div>
      
      <h3 style="margin-bottom: 16px;">Items requiring your attention:</h3>
      
      ${discrepancyItems.map(item => `
        <div class="discrepancy-item">
          <div class="item-name">${item.product_name}</div>
          <div class="quantity-change">
            <span class="quantity-badge">Expected: ${item.expected_quantity}</span>
            <span class="arrow">→</span>
            <span class="quantity-badge">Found: ${item.actual_quantity}</span>
          </div>
          ${item.notes ? `<div style="color: #6b7280; font-size: 14px;">${item.notes}</div>` : ''}
        </div>
      `).join('')}
      
      <div class="cta-section">
        <div class="cta-title">Action Required</div>
        <p class="cta-text">
          Please review these items and let us know how you'd like to proceed. You can approve the changes or decline any items you don't want cleaned.
        </p>
        <a href="${cta_url}" class="cta-button">Review Items Now</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        This review is required before we can continue processing your order. If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        <strong>eazyy</strong> - Professional laundry care
      </div>
      <div class="footer-text">
        Questions? Contact us at <a href="mailto:hello@eazyy.com" style="color: #1D62DB;">hello@eazyy.com</a>
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
    const payload: DiscrepancyEmailPayload = await req.json()
    
    if (!payload.email || !payload.orderNumber || !payload.discrepancyItems) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, orderNumber, discrepancyItems" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const emailHTML = generateDiscrepancyEmailHTML(payload)
    
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer re_MYAcaj94_MynPQijaMi7BWxgxkNf3kYJp`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "eazyy <orders@eazyy.com>",
        to: [payload.email],
        subject: `Order Update Required - eazyy Order #${payload.orderNumber}`,
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
        message: "Discrepancy notification email sent successfully" 
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