import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { name, email, phone, event_type, event_date, guest_count, venue, message } = body;

  if (!name || !email || !event_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await supabase.from("inquiries").insert([{
    name,
    email,
    phone: phone || null,
    event_type,
    event_date: event_date || null,
    guest_count: guest_count || null,
    venue: venue || null,
    message: message || null,
  }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
