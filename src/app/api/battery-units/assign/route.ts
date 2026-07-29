import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { unitIds, dealerId, assignedAt } = await request.json()

    if (!unitIds || !Array.isArray(unitIds) || !dealerId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // Assign units to the dealer
    await prisma.batteryUnit.updateMany({
      where: {
        id: { in: unitIds },
        dealerId: null // Only assign units that aren't already assigned
      },
      data: {
        dealerId: dealerId,
        assignedAt: assignedAt ? new Date(assignedAt) : new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Assignment error:', error)
    return NextResponse.json({ error: 'Failed to assign units' }, { status: 500 })
  }
}
