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
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 32px; text-align: center; color: white;">
      <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
      <div style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">eazyy</div>
      <p style="font-size: 16px; opacity: 0.9; margin: 0;">Order update required</p>
    </div>
    
    <div style="padding: 32px;">
      <div style="font-size: 18px; font-weight: 500; margin-bottom: 16px;">
        Hi ${firstName || 'there'},
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">Extra Items Found</div>
        <p style="color: #92400e; margin: 0;">
          Our team at ${facilityName} found some differences between what was ordered and what was received. Please review these items below.
        </p>
      </div>
      
      <div style="font-size: 24px; font-weight: 700; color: #1D62DB; margin-bottom: 16px; text-align: center;">#${orderNumber}</div>
      
      <h3 style="margin-bottom: 16px;">Items requiring your attention:</h3>
      
      ${discrepancyItems.map(item => `
        <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 8px;">${item.product_name}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Expected: ${item.expected_quantity}</span>
            <span style="color: #6b7280;">→</span>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Found: ${item.actual_quantity}</span>
          </div>
          ${item.notes ? `<div style="color: #6b7280; font-size: 14px;">${item.notes}</div>` : ''}
        </div>
      `).join('')}
      
      <div style="background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%); border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
        <div style="color: white; font-size: 20px; font-weight: 600; margin-bottom: 12px;">Action Required</div>
        <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 24px;">
          Please review these items and let us know how you'd like to proceed.
        </p>
        <a href="${cta_url}" style="display: inline-block; background-color: white; color: #1D62DB; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;">Review Items Now</a>
      </div>
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
        from: "eazyy <orders@eazyy.com>",
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