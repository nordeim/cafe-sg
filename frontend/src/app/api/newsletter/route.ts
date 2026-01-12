import { NextResponse, type NextRequest } from "next/server";

type RateLimitEntry = {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5

function getRateLimitStore(): Map<string, RateLimitEntry> {
  const g = globalThis as unknown as { __newsletterRateLimit?: Map<string, RateLimitEntry> }
  if (!g.__newsletterRateLimit) g.__newsletterRateLimit = new Map()
  return g.__newsletterRateLimit
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown"
  const ua = request.headers.get("user-agent") || "unknown"
  return `${ip}:${ua}`
}

function isValidEmail(email: string): boolean {
  if (email.length < 3 || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || ""
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
  }

  const key = getClientKey(request)
  const store = getRateLimitStore()
  const now = Date.now()
  const current = store.get(key)

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
  } else {
    current.count += 1
    store.set(key, current)
    if (current.count > RATE_LIMIT_MAX) {
      const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      )
    }
  }

  const baseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = typeof (body as any).email === "string" ? (body as any).email.trim() : ""
  const consentMarketing = (body as any).consent_marketing === true

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  if (!consentMarketing) {
    return NextResponse.json({ error: "Consent required" }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const res = await fetch(`${baseUrl}/api/v1/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ email, consent_marketing: true }),
      signal: controller.signal,
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 })
    }

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
