import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qr = searchParams.get('qr');

  if (!qr) return NextResponse.json({ exists: false });

  try {
    const unit = await prisma.batteryUnit.findUnique({
      where: { qrNumber: qr.toUpperCase() }
    });
    return NextResponse.json({ exists: !!unit });
  } catch (error) {
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}
