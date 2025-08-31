import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface QuoteEmailPayload {
  email: string
  firstName?: string
  quoteId: string
  itemName: string
  quotedPrice: number
  estimatedDays: number
  facilityNotes?: string
  cta_url: string
}

const generateQuoteEmailHTML = (data: QuoteEmailPayload) => {
  const { firstName, quoteId, itemName, quotedPrice, estimatedDays, facilityNotes, cta_url } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Quote Ready - eazyy</title>
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
    .quote-icon {
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
    .quote-ready-box {
      background-color: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .quote-ready-title {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 8px;
      font-size: 18px;
    }
    .quote-ready-text {
      color: #1e40af;
      margin: 0;
    }
    .quote-details {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .item-name {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
      text-align: center;
    }
    .price-section {
      text-align: center;
      margin: 24px 0;
    }
    .quoted-price {
      font-size: 36px;
      font-weight: 700;
      color: #1D62DB;
      margin-bottom: 4px;
    }
    .price-label {
      color: #6b7280;
      font-size: 14px;
    }
    .details-grid {
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
      text-align: center;
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
    .facility-notes {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
    .facility-notes-title {
      font-weight: 600;
      color: #0369a1;
      margin-bottom: 8px;
    }
    .facility-notes-text {
      color: #0369a1;
      margin: 0;
      font-style: italic;
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
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .content {
        padding: 24px 20px;
      }
      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="quote-icon">📋</div>
      <div class="logo">eazyy</div>
      <p class="header-subtitle">Your custom quote is ready</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${firstName || 'there'},
      </div>
      
      <div class="quote-ready-box">
        <div class="quote-ready-title">Quote Ready for Review</div>
        <p class="quote-ready-text">
          Our experts have carefully reviewed your item and prepared a detailed quote for you.
        </p>
      </div>
      
      <div class="quote-details">
        <div class="item-name">${itemName}</div>
        
        <div class="price-section">
          <div class="quoted-price">€${quotedPrice.toFixed(2)}</div>
          <div class="price-label">Expert quoted price</div>
        </div>
        
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Quote ID</div>
            <div class="detail-value">#${quoteId}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Estimated Time</div>
            <div class="detail-value">${estimatedDays} business days</div>
          </div>
        </div>
        
        ${facilityNotes ? `
        <div class="facility-notes">
          <div class="facility-notes-title">Expert Notes</div>
          <p class="facility-notes-text">"${facilityNotes}"</p>
        </div>
        ` : ''}
      </div>
      
      <div class="cta-section">
        <div class="cta-title">Review Your Quote</div>
        <p class="cta-text">
          Click below to review the full quote details and decide whether to proceed with your order.
        </p>
        <a href="${cta_url}" class="cta-button">Review Quote</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        This quote is valid for 7 days. No payment is required until you approve the quote and we complete the service.
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
    const payload: QuoteEmailPayload = await req.json()
    
    if (!payload.email || !payload.quoteId || !payload.itemName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, quoteId, itemName" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const emailHTML = generateQuoteEmailHTML(payload)
    
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer re_MYAcaj94_MynPQijaMi7BWxgxkNf3kYJp`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "eazyy <quotes@eazyy.com>",
        to: [payload.email],
        subject: `Custom Quote Ready - eazyy Quote #${payload.quoteId}`,
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
        message: "Quote notification email sent successfully" 
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