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
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%); padding: 40px 32px; text-align: center; color: white;">
      <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
      <div style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">eazyy</div>
      <p style="font-size: 16px; opacity: 0.9; margin: 0;">Your custom quote is ready</p>
    </div>
    
    <div style="padding: 32px;">
      <div style="font-size: 18px; font-weight: 500; margin-bottom: 16px;">
        Hi ${firstName || 'there'},
      </div>
      
      <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px; font-size: 18px;">Quote Ready for Review</div>
        <p style="color: #1e40af; margin: 0;">
          Our experts have carefully reviewed your item and prepared a detailed quote for you.
        </p>
      </div>
      
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 16px; text-align: center;">${itemName}</div>
        
        <div style="text-align: center; margin: 24px 0;">
          <div style="font-size: 36px; font-weight: 700; color: #1D62DB; margin-bottom: 4px;">€${quotedPrice.toFixed(2)}</div>
          <div style="color: #6b7280; font-size: 14px;">Expert quoted price</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0;">
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">QUOTE ID</div>
            <div style="font-weight: 600;">#${quoteId}</div>
          </div>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">ESTIMATED TIME</div>
            <div style="font-weight: 600;">${estimatedDays} business days</div>
          </div>
        </div>
        
        ${facilityNotes ? `
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <div style="font-weight: 600; color: #0369a1; margin-bottom: 8px;">Expert Notes</div>
          <p style="color: #0369a1; margin: 0; font-style: italic;">"${facilityNotes}"</p>
        </div>
        ` : ''}
      </div>
      
      <div style="background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
        <div style="color: white; font-size: 20px; font-weight: 600; margin-bottom: 12px;">Review Your Quote</div>
        <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 24px;">
          Click below to review the full quote details and decide whether to proceed with your order.
        </p>
        <a href="${cta_url}" style="display: inline-block; background-color: white; color: #1D62DB; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;">Review Quote</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center;">
        This quote is valid for 7 days. No payment is required until you approve the quote.
      </p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <div style="color: #6b7280; font-size: 14px; margin: 8px 0;">
        <strong>eazyy</strong> - Professional laundry care
      </div>
      <div style="color: #6b7280; font-size: 14px;">
        Questions? Contact us at <a href="mailto:hello@eazyy.com" style="color: #1D62DB;">hello@eazyy.com</a>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    console.log("Discrepancy email function called")
    
    const payload: DiscrepancyEmailPayload = await req.json()
    console.log("Received payload:", JSON.stringify(payload, null, 2))
    
    // Validate required fields
    if (!payload.email || !payload.orderNumber || !payload.discrepancyItems) {
      console.error("Missing required fields")
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, orderNumber, discrepancyItems" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log("Generating email HTML...")
    const emailHTML = generateDiscrepancyEmailHTML(payload)
    
    console.log("Sending email via Resend...")
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer re_MYAcaj94_MynPQijaMi7BWxgxkNf3kYJp`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "eazyy <admin@eazyy.app>",
        to: [payload.email],
        subject: `Order Update Required - eazyy Order #${payload.orderNumber}`,
        html: emailHTML,
      }),
    })

    console.log("Resend response status:", resendResponse.status)

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error("Resend API error:", errorText)
      return new Response(
        JSON.stringify({ error: `Resend API error: ${resendResponse.status} - ${errorText}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const resendData = await resendResponse.json()
    console.log("Email sent successfully:", resendData.id)
    
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
    console.error("Email function error:", error)
    
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