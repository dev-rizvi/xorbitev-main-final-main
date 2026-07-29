import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qr = searchParams.get('qr');

    const where: any = {};
    if (qr) {
      where.qrNumber = qr;
    }

    const repairs = await prisma.batteryRepair.findMany({
      where,
      include: {
        dealer: true,
        battery: true
      },
      orderBy: { receivedAt: 'desc' }
    });
    return NextResponse.json(repairs);
  } catch (error) {
    console.error('Repairs GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch repairs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sn, dealerId, problemRemark, solvedRemark, status, receivedAt, solvedAt } = data;

    if (!sn) {
      return NextResponse.json({ error: 'Battery S/N is required' }, { status: 400 });
    }

    // First, try to find a physical unit by QR Number
    let battery = null;
    const unit = await prisma.batteryUnit.findUnique({
      where: { qrNumber: sn },
      include: { model: true }
    });

    if (unit) {
      battery = unit.model;
    } else {
      // Fallback to checking BatteryDetail by S/N if no unit matches
      battery = await prisma.batteryDetail.findUnique({ where: { sn } });
    }

    if (!battery) {
      return NextResponse.json({ error: 'Battery not found with this QR or S/N' }, { status: 404 });
    }

    const repair = await prisma.batteryRepair.create({
      data: {
        batteryDetailId: battery.id,
        qrNumber: unit ? sn : null,
        dealerId: dealerId || null,
        problemRemark: problemRemark || null,
        solvedRemark: solvedRemark || null,
        status: status || 'pending',
        receivedAt: (receivedAt && !isNaN(Date.parse(receivedAt))) ? new Date(receivedAt) : new Date(),
        solvedAt: (solvedAt && !isNaN(Date.parse(solvedAt))) ? new Date(solvedAt) : null,
      },
      include: { dealer: true, battery: true }
    });
    
    return NextResponse.json(repair);
  } catch (error: any) {
    console.error('Repairs POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to create repair entry', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, dealerId, problemRemark, solvedRemark, status, receivedAt, solvedAt } = data;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    const updateData: any = { 
      status, 
      solvedRemark, 
      problemRemark,
      dealerId: dealerId || null 
    };
    
    if (receivedAt) updateData.receivedAt = new Date(receivedAt);
    if (solvedAt) updateData.solvedAt = new Date(solvedAt);
    else updateData.solvedAt = null;

    const repair = await prisma.batteryRepair.update({
      where: { id },
      data: updateData,
      include: { dealer: true, battery: true }
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error('Repairs PUT error:', error);
    return NextResponse.json({ error: 'Failed to update repair status' }, { status: 500 });
  }
}
