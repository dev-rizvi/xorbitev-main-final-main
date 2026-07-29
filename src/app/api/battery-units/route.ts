import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qr = searchParams.get('qr');

    if (qr) {
      const unit = await prisma.batteryUnit.findUnique({
        where: { qrNumber: qr },
        include: { 
          model: { select: { id: true, name: true, category: true, nominalVoltage: true, nominalCapacity: true, warrantyMonths: true } },
          dealer: true,
          supplier: { select: { id: true, name: true, contactPerson: true } }
        }
      });
      return NextResponse.json(unit);
    }

    const units = await prisma.batteryUnit.findMany({
      include: { 
        model: { select: { id: true, name: true, category: true, nominalVoltage: true, nominalCapacity: true, warrantyMonths: true } },
        dealer: true,
        supplier: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error('BatteryUnit GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch battery units' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (Array.isArray(data)) {
      // Bulk Create
      const units = await prisma.batteryUnit.createMany({
        data: data.map(unit => ({
          qrNumber: unit.qrNumber,
          modelId: unit.modelId,
          manufactureDate: (unit.manufactureDate && !isNaN(new Date(unit.manufactureDate).getTime())) ? new Date(unit.manufactureDate) : null,
          status: unit.status || 'active',
          supplierId: unit.supplierId || null,
          warrantyMonthsOverride: unit.warrantyMonthsOverride ? parseInt(unit.warrantyMonthsOverride) : null,
          remark: unit.remark || null,
        })),
        skipDuplicates: false,
      });
      return NextResponse.json({ success: true, count: units.count });
    }

    // Single Create
    const unit = await prisma.batteryUnit.create({
      data: {
        qrNumber: data.qrNumber,
        modelId: data.modelId,
        manufactureDate: (data.manufactureDate && !isNaN(new Date(data.manufactureDate).getTime())) ? new Date(data.manufactureDate) : null,
        status: data.status || 'active',
        supplierId: data.supplierId || null,
        warrantyMonthsOverride: data.warrantyMonthsOverride ? parseInt(data.warrantyMonthsOverride) : null,
        remark: data.remark || null,
      },
      include: { model: true }
    });
    return NextResponse.json(unit);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'One or more QR Numbers already exist' }, { status: 409 });
    }
    console.error('BatteryUnit POST error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: 'Failed to create battery unit(s)', 
      details: error.message 
    }, { status: 500 });
  }
}
