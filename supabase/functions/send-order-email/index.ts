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
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #1D62DB 0%, #2675f5 100%); padding: 40px 32px; text-align: center; color: white;">
      <div style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">eazyy</div>
      <p style="font-size: 16px; opacity: 0.9; margin: 0;">Your laundry order is confirmed</p>
    </div>
    
    <div style="padding: 32px;">
      <div style="font-size: 18px; font-weight: 500; margin-bottom: 16px;">
        Hi ${firstName || customerName || 'there'},
      </div>
      
      <p>Thank you for choosing eazyy! Your laundry order has been successfully placed.</p>
      
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div style="font-size: 24px; font-weight: 700; color: #1D62DB; margin-bottom: 8px;">#${orderNumber}</div>
        
        <div style="margin: 20px 0;">
          ${pickupDate ? `<p><strong>Pickup:</strong> ${new Date(pickupDate).toLocaleDateString()}</p>` : ''}
          ${deliveryDate ? `<p><strong>Delivery:</strong> ${new Date(deliveryDate).toLocaleDateString()}</p>` : ''}
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Items:</strong> ${items.length} item${items.length > 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <div style="margin: 24px 0;">
        <h3>Order Items</h3>
        ${items.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
            <span>${item.name} ×${item.quantity}</span>
            <span style="font-weight: 600; color: #1D62DB;">€${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="background-color: #1D62DB; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <div style="font-size: 32px; font-weight: 700; margin-bottom: 4px;">€${totalAmount.toFixed(2)}</div>
        <div style="font-size: 14px; opacity: 0.9;">Total Amount</div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://eazyy.app/orders" style="display: inline-block; background-color: #1D62DB; color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600;">Track Your Order</a>
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
    console.log("Order email function called")
    
    const payload: OrderEmailPayload = await req.json()
    console.log("Received payload:", JSON.stringify(payload, null, 2))
    
    // Validate required fields
    if (!payload.email || !payload.orderNumber) {
      console.error("Missing required fields")
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, orderNumber" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log("Generating email HTML...")
    const emailHTML = generateOrderEmailHTML(payload)
    
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
        subject: `Order Confirmation - eazyy Order #${payload.orderNumber}`,
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
        message: "Order confirmation email sent successfully" 
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