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
        battery: true,
      },
    });

    if (!repair) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 });
    }

    let batteryUnit = null;
    if (repair.qrNumber) {
      batteryUnit = await prisma.batteryUnit.findUnique({
        where: { qrNumber: repair.qrNumber },
        include: {
          model: true,
          dealer: true,
          supplier: true,
        },
      });
    }

    return NextResponse.json({
      ...repair,
      batteryUnit,
    });
  } catch (error) {
    console.error('Repair GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch repair' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.batteryRepair.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Repair DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete repair entry' }, { status: 500 });
  }
}
