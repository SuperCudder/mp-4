import { NextResponse } from 'next/server';
import { getParks } from '@/app/actions/nps';

export async function GET() {
  try {
    const parks = await getParks(undefined, 500); /* get more parks for comparison */
    return NextResponse.json(parks);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch parks' }, { status: 500 });
  }
}
