import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { supabaseAdmin } from "./lib/supabase";
import { createOrder } from "./routes/orders";
import { postLocation, postPod, postScan } from './routes/driver';
import { planRoute } from './routes/route';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/contact", handleContact);

  app.get("/api/messages", async (_req, res) => {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("id, first_name, last_name, email, phone, subject, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    res.json({ ok: true, data });
  });

  app.post('/api/orders', createOrder);
  // Driver endpoints (simple validation; expand as needed)
  app.post('/api/driver/scan', postScan);
  app.post('/api/driver/pod', postPod);
  app.post('/api/driver/location', postLocation);
  app.post('/api/route/plan', planRoute);

  return app;
}
