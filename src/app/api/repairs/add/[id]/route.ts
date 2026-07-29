import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const repair = await prisma.batteryRepair.findUnique({
      where: { id },
      include: {
        dealer: true,
        battery: true
      }
    });

    if (!repair) {
      return NextResponse.json({ error: 'Repair log not found' }, { status: 404 });
    }

    return NextResponse.json(repair);
  } catch (error) {
    console.error('Repair Detail GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch repair details' }, { status: 500 });
  }
}
