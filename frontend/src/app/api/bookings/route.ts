import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${baseUrl}/api/v1/events`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    // Mock data for build/demo if backend offline
    return NextResponse.json({
        data: [
            {
                id: '1',
                title: 'Peranakan Coffee Ceremony',
                description: 'Experience the ritual of traditional Peranakan coffee preparation.',
                price_cents: 0,
                sessions: [
                    { id: 's1', starts_at: new Date().toISOString(), capacity: 10, booked_count: 2 }
                ]
            }
        ]
    });
  }
}

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const body = await request.json();

  try {
    const res = await fetch(`${baseUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json();
        return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
