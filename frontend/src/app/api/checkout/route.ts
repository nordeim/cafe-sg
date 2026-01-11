import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const body = await request.json();

  try {
    const res = await fetch(`${baseUrl}/api/v1/orders/draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        reservation_id: body.reservationId,
        email: body.email
      }),
    });

    if (!res.ok) {
        const error = await res.json();
        return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ clientSecret: data.client_secret });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
