import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if unit exists
    const currentUnit = await prisma.batteryUnit.findUnique({ where: { id } });
    if (!currentUnit) {
      return NextResponse.json({ error: 'Battery unit not found' }, { status: 404 });
    }

    // Unassign unit from dealer and clear client info
    const updated = await prisma.batteryUnit.update({
      where: { id },
      data: {
        dealerId: null,
        assignedAt: null,
        clientName: null,
        clientPhone: null,
        clientAssignedAt: null,
        dealerRemark: null,
      },
    });

    return NextResponse.json({ success: true, unit: updated });
  } catch (error: any) {
    console.error("Unassign Error:", error);
    return NextResponse.json({ error: 'Failed to unassign unit', details: error.message }, { status: 500 });
  }
}
