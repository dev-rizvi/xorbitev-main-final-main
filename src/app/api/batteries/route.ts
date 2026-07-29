import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all batteries (excluding soft-deleted)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible') === 'true'

    const whereClause: any = { deletedAt: null }
    if (visibleOnly) {
      whereClause.showOnWebsite = true
    }

    const batteries = await prisma.batteryDetail.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(batteries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch batteries' }, { status: 500 })
  }
}

// POST create new battery
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Auto-generate SN if not provided
    if (!data.sn) {
      const count = await prisma.batteryDetail.count()
      data.sn = `SN-XOR-${String(count + 1).padStart(3, '0')}`
    }

    const allowedFields = [
      'sn', 'name', 'category', 'nominalVoltage', 'fullyChargedVoltage', 
      'dischargeCutOff', 'nominalCapacity', 'totalEnergy', 
      'cellConfiguration', 'motorCompatibility', 'application', 
      'avgRidingCurrent', 'estRuntime', 'estRange', 
      'energyEfficiency', 'cycleLife', 'chargingTime', 'status', 
      'image', 'warrantyMonths', 'showOnWebsite'
    ];

    const createData: any = { status: 'active' };
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        createData[field] = data[field];
      }
    });

    const battery = await prisma.batteryDetail.create({
      data: createData
    });
    return NextResponse.json(battery)
  } catch (error) {
    console.error('Create error:', error)
    return NextResponse.json({ error: 'Failed to create battery' }, { status: 500 })
  }
}
