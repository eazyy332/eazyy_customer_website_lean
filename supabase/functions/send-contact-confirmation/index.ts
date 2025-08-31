import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface ContactEmailPayload {
  email: string
  firstName: string
  lastName: string
  subject: string
  message: string
}

const generateContactConfirmationHTML = (data: ContactEmailPayload) => {
  const { firstName, subject, message } = data
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting eazyy</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%); padding: 40px 32px; text-align: center; color: white;">
      <div style="font-size: 48px; margin-bottom: 16px;">📧</div>
      <div style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">eazyy</div>
      <p style="font-size: 16px; opacity: 0.9; margin: 0;">Thank you for contacting us</p>
    </div>
    
    <div style="padding: 32px;">
      <div style="font-size: 18px; font-weight: 500; margin-bottom: 16px;">
        Hi ${firstName},
      </div>
      
      <p>Thank you for reaching out to eazyy! We've received your message and our team will get back to you within 24 hours.</p>
      
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="margin-top: 0; color: #1D62DB;">Your Message:</h3>
        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 12px 0;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0;"><strong>Message:</strong></p>
          <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-top: 8px; font-style: italic;">
            "${message}"
          </div>
        </div>
      </div>
      
      <div style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">What happens next?</div>
        <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
          <li>Our customer service team will review your message</li>
          <li>You'll receive a personalized response within 24 hours</li>
          <li>For urgent matters, call us at <strong>1-800-EAZZY-1</strong></li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://eazyy.app/help" style="display: inline-block; background-color: #1D62DB; color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;">Visit Help Center</a>
      </div>
    </div>
    
    <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <div style="color: #6b7280; font-size: 14px; margin: 8px 0;">
        <strong>eazyy</strong> - Laundry pickup and delivery in 24–48h
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
    console.log("Contact confirmation email function called")
    
    const payload: ContactEmailPayload = await req.json()
    console.log("Received payload:", JSON.stringify(payload, null, 2))
    
    // Validate required fields
    if (!payload.email || !payload.firstName || !payload.subject) {
      console.error("Missing required fields")
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, firstName, subject" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log("Generating email HTML...")
    const emailHTML = generateContactConfirmationHTML(payload)
    
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
        subject: `Thank you for contacting eazyy - Re: ${payload.subject}`,
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
        message: "Contact confirmation email sent successfully" 
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