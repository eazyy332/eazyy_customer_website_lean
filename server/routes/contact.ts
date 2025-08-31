import type { Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { sendContactConfirmationEmail } from "../lib/emailService";

export async function handleContact(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body ?? {};

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // Insert message into Supabase table `contact_messages`
    const { error: dbError } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        subject,
        message,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      return res.status(500).json({ ok: false, error: dbError.message });
    }

    // Send confirmation email to customer
    try {
      await sendContactConfirmationEmail({
        email,
        firstName,
        lastName,
        subject,
        message
      });
      console.log('Contact confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError);
      // Don't fail the contact form if email fails
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Unexpected error" });
  }
}


