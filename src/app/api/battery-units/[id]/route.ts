import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const unit = await prisma.batteryUnit.findUnique({
      where: { id },
      include: { model: true, dealer: true, supplier: true }
    });
    if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    
    // Check if unit exists
    const currentUnit = await prisma.batteryUnit.findUnique({ where: { id } });
    if (!currentUnit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updateData: any = {};
    
    // Core fields - only update if not assigned to a dealer
    if (!currentUnit.dealerId) {
      if (data.qrNumber !== undefined) updateData.qrNumber = data.qrNumber;
      if (data.modelId !== undefined) updateData.modelId = data.modelId;
      if (data.manufactureDate !== undefined) {
        if (data.manufactureDate) {
          const d = new Date(data.manufactureDate);
          updateData.manufactureDate = isNaN(d.getTime()) ? null : d;
        } else {
          updateData.manufactureDate = null;
        }
      }
      if (data.supplierId !== undefined) updateData.supplierId = data.supplierId || null;
    }

    // Always updateable fields
    if (data.status !== undefined) updateData.status = data.status;
    if (data.clientName !== undefined) updateData.clientName = data.clientName;
    if (data.clientPhone !== undefined) updateData.clientPhone = data.clientPhone;
    if (data.clientAssignedAt !== undefined) {
      if (data.clientAssignedAt) {
        const d = new Date(data.clientAssignedAt);
        updateData.clientAssignedAt = isNaN(d.getTime()) ? null : d;
      } else {
        updateData.clientAssignedAt = null;
      }
    }
    if (data.remark !== undefined) updateData.remark = data.remark;
    if (data.dealerRemark !== undefined) updateData.dealerRemark = data.dealerRemark;
    
    if (data.warrantyMonthsOverride !== undefined) {
      if (data.warrantyMonthsOverride === "" || data.warrantyMonthsOverride === null) {
        updateData.warrantyMonthsOverride = null;
      } else {
        const parsed = parseInt(data.warrantyMonthsOverride);
        updateData.warrantyMonthsOverride = isNaN(parsed) ? null : parsed;
      }
    }

    const unit = await prisma.batteryUnit.update({
      where: { id },
      data: updateData,
      include: { model: true }
    });

    return NextResponse.json(unit);
  } catch (error: any) {
    console.error("PUT Error:", error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'QR Number already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const currentUnit = await prisma.batteryUnit.findUnique({ where: { id } });
    if (currentUnit?.dealerId) {
      return NextResponse.json({ error: 'Assigned units cannot be deleted' }, { status: 403 });
    }

    await prisma.batteryUnit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
