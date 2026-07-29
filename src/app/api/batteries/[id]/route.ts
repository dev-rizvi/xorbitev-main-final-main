import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

// GET single battery
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const battery = await prisma.batteryDetail.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            dealer: true
          },
          orderBy: { assignedAt: 'desc' }
        },
        repairs: {
          include: {
            dealer: true
          },
          orderBy: { receivedAt: 'desc' }
        },
        units: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    if (!battery || battery.deletedAt) {
      return NextResponse.json({ error: 'Battery not found' }, { status: 404 })
    }
    return NextResponse.json(battery)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch battery' }, { status: 500 })
  }
}

// PUT update battery
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Define allowed fields for update
    const allowedFields = [
      'name', 'category', 'nominalVoltage', 'fullyChargedVoltage', 
      'dischargeCutOff', 'nominalCapacity', 'totalEnergy', 
      'cellConfiguration', 'motorCompatibility', 'application', 
      'avgRidingCurrent', 'estRuntime', 'estRange', 
      'energyEfficiency', 'cycleLife', 'chargingTime', 'status', 
      'image', 'warrantyMonths', 'showOnWebsite'
    ];

    const updateData: any = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    const battery = await prisma.batteryDetail.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(battery)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update battery' }, { status: 500 })
  }
}

// DELETE soft delete battery
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    await prisma.batteryDetail.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'deleted' }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete battery' }, { status: 500 })
  }
}
