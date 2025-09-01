/*
  # Add discrepancy email notification trigger

  1. Functions
    - Create function to send discrepancy email when order status changes to pending_item_confirmation
    - Queue email notification for customer review

  2. Triggers
    - Add trigger on orders table for status changes to pending_item_confirmation
    - Ensure customer gets notified when discrepancies are found

  3. Email Queue
    - Queue discrepancy notification emails for processing
*/

-- Function to send discrepancy notification email
CREATE OR REPLACE FUNCTION send_discrepancy_notification()
RETURNS TRIGGER AS $$
DECLARE
  customer_email TEXT;
  customer_name TEXT;
  order_number TEXT;
  discrepancy_count INTEGER;
  email_content TEXT;
  cta_url TEXT;
BEGIN
  -- Only trigger for status change to pending_item_confirmation
  IF NEW.status = 'pending_item_confirmation' AND OLD.status != 'pending_item_confirmation' THEN
    
    -- Get customer details
    SELECT email, customer_name, order_number 
    INTO customer_email, customer_name, order_number
    FROM orders 
    WHERE id = NEW.id;
    
    -- Count discrepancy items for this order
    SELECT COUNT(*) 
    INTO discrepancy_count
    FROM discrepancy_items 
    WHERE order_id = NEW.id;
    
    -- Only send email if there are discrepancy items
    IF discrepancy_count > 0 AND customer_email IS NOT NULL THEN
      
      -- Build CTA URL
      cta_url := 'https://eazyy.app/discrepancy/' || NEW.id;
      
      -- Build email content
      email_content := format('
        <h2>Extra Items Found in Your Order</h2>
        <p>Hi %s,</p>
        <p>Our facility found %s additional items in your order #%s that weren''t originally listed.</p>
        <p>Please review these items and decide whether you''d like us to clean them for an additional fee.</p>
        <p><a href="%s" style="background-color: #1D62DB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Review Items Now</a></p>
        <p>Best regards,<br>The eazyy Team</p>
      ', 
      customer_name, 
      discrepancy_count, 
      order_number, 
      cta_url);
      
      -- Queue email for sending
      INSERT INTO email_queue (
        recipient,
        subject,
        content,
        status,
        metadata
      ) VALUES (
        customer_email,
        format('Extra Items Found - Order #%s', order_number),
        email_content,
        'pending',
        jsonb_build_object(
          'order_id', NEW.id,
          'order_number', order_number,
          'type', 'discrepancy_notification',
          'discrepancy_count', discrepancy_count
        )
      );
      
      RAISE NOTICE 'Discrepancy email queued for order % to %', order_number, customer_email;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on orders table
DROP TRIGGER IF EXISTS send_discrepancy_notification_trigger ON orders;
CREATE TRIGGER send_discrepancy_notification_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION send_discrepancy_notification();