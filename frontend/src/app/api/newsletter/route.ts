import { NextResponse } from "next/server";

// Simple in-memory rate limiter for demo/MVP purposes
// In production, use Redis (e.g., via upstash/ratelimit)
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export async function POST(request: Request) {
  // 1. Content-Type Guard
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return new NextResponse("Unsupported Media Type", { status: 415 });
  }

  // 2. Rate Limiting (IP-based)
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Cleanup old entries
  // (In a real app, this would be handled by the store expiration)
  
  const requestTimestamps = rateLimit.get(ip) || [];
  const recentRequests = requestTimestamps.filter(t => t > windowStart);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { 
      status: 429,
      headers: { 'Retry-After': '60' }
    });
  }
  
  rateLimit.set(ip, [...recentRequests, now]);

  try {
    const body = await request.json();
    const { email, consent_marketing } = body;

    // 3. Input Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (consent_marketing !== true) {
      return NextResponse.json(
        { error: "Consent is required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    // 4. Timeouts & Fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const res = await fetch(`${baseUrl}/api/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // 5. Payload Whitelisting (Don't just forward `body`)
        body: JSON.stringify({ 
          email, 
          consent_marketing 
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Log the error internally but don't leak upstream details to client
        console.error(`Newsletter API Error: ${res.status}`);
        return NextResponse.json(
          { error: "Subscription failed" }, 
          { status: res.status === 422 ? 422 : 502 }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ error: "Service timeout" }, { status: 504 });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error("Newsletter Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}