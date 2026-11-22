import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";
    const body = await req.arrayBuffer();
    const sig = req.headers.get("stripe-signature") || "";

    const backendRes = await fetch(`${serverUrl}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "stripe-signature": sig,
      },
      body: Buffer.from(body),
    });

    const data = await backendRes.text();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: {
        "content-type": backendRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook forward error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
