import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.54.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    console.log("Processing email queue...")
    
    // Get pending emails from queue
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10) // Process 10 emails at a time
    
    if (fetchError) {
      console.error("Error fetching emails:", fetchError)
      return new Response(
        JSON.stringify({ error: `Database error: ${fetchError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log("No pending emails found")
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No pending emails to process",
          processed: 0,
          failed: 0,
          total: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log(`Found ${pendingEmails.length} pending emails`)
    
    let processed = 0
    let failed = 0

    // Process each email
    for (const email of pendingEmails) {
      try {
        console.log(`Processing email ${email.id} to ${email.recipient}`)
        
        // Mark as processing
        await supabase
          .from('email_queue')
          .update({ status: 'processing' })
          .eq('id', email.id)

        // Send email via Resend
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer re_MYAcaj94_MynPQijaMi7BWxgxkNf3kYJp`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "eazyy <orders@eazyy.com>",
            to: [email.recipient],
            subject: email.subject,
            html: email.content,
          }),
        })

        if (resendResponse.ok) {
          const resendData = await resendResponse.json()
          
          // Mark as sent
          await supabase
            .from('email_queue')
            .update({ 
              status: 'sent',
              processed_at: new Date().toISOString(),
              metadata: { 
                ...email.metadata, 
                resend_id: resendData.id 
              }
            })
            .eq('id', email.id)
          
          processed++
          console.log(`✅ Sent email ${email.id} to ${email.recipient}`)
        } else {
          const errorText = await resendResponse.text()
          console.error(`❌ Failed to send email ${email.id}:`, errorText)
          
          // Mark as failed
          await supabase
            .from('email_queue')
            .update({ 
              status: 'failed',
              processed_at: new Date().toISOString(),
              error_message: `Resend API error: ${resendResponse.status} - ${errorText}`
            })
            .eq('id', email.id)
          
          failed++
        }
      } catch (emailError) {
        console.error(`❌ Error processing email ${email.id}:`, emailError)
        
        // Mark as failed
        await supabase
          .from('email_queue')
          .update({ 
            status: 'failed',
            processed_at: new Date().toISOString(),
            error_message: emailError.message
          })
          .eq('id', email.id)
        
        failed++
      }
    }

    console.log(`Email processing complete: ${processed} sent, ${failed} failed`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email queue processed`,
        processed,
        failed,
        total: pendingEmails.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error("Email queue processing error:", error)
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process email queue", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})