import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sn = searchParams.get('sn');

    if (!sn) {
      return NextResponse.json({ error: 'Serial number is required' }, { status: 400 });
    }

    // Search for a specific physical battery unit
    const unit = await prisma.batteryUnit.findUnique({
      where: { qrNumber: sn },
      include: {
        model: true,
        dealer: true,
        supplier: true
      }
    });

    if (!unit) {
      return NextResponse.json({ verified: false }, { status: 404 });
    }

    const battery = unit.model;

    const repairs = await prisma.batteryRepair.findMany({
      where: { qrNumber: unit.qrNumber },
      orderBy: { receivedAt: 'desc' },
      select: {
        id: true,
        receivedAt: true,
        status: true,
        issue: true,
        solvedRemark: true,
        solvedAt: true
      }
    });

    return NextResponse.json({
      verified: true,
      battery: {
        sn: unit.qrNumber,
        name: battery.name,
        category: battery.category,
        image: battery.image,
        nominalVoltage: battery.nominalVoltage,
        fullyChargedVoltage: battery.fullyChargedVoltage,
        dischargeCutOff: battery.dischargeCutOff,
        nominalCapacity: battery.nominalCapacity,
        totalEnergy: battery.totalEnergy,
        cellConfiguration: battery.cellConfiguration,
        application: battery.application,
        motorCompatibility: battery.motorCompatibility,
        estRange: battery.estRange,
        chargingTime: battery.chargingTime,
        cycleLife: battery.cycleLife,
        energyEfficiency: battery.energyEfficiency,
        estRuntime: battery.estRuntime,
        avgRidingCurrent: battery.avgRidingCurrent,
        status: unit.status,
        mfgDate: unit.manufactureDate || unit.createdAt,
        // Warranty Data
        warrantyMonths: unit.warrantyMonthsOverride || battery.warrantyMonths,
        clientName: unit.clientName,
        clientAssignedAt: unit.clientAssignedAt,
        dealerName: unit.dealer?.name,
        dealerAssignedAt: unit.assignedAt,
        vendorName: unit.supplier?.name,
        repairs: repairs
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
