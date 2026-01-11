import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${baseUrl}/api/v1/products`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
