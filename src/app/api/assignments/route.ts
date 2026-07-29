import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { dealerId, batteryDetailId, quantity } = await req.json();

    // Check if assignment already exists
    const existing = await prisma.batteryAssignment.findFirst({
      where: {
        dealerId,
        batteryDetailId,
      },
    });

    if (existing) {
      const updated = await prisma.batteryAssignment.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + parseInt(quantity),
        },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.batteryAssignment.create({
        data: {
          dealerId,
          batteryDetailId,
          quantity: parseInt(quantity),
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const assignments = await prisma.batteryAssignment.findMany({
      include: {
        dealer: true,
        battery: true,
      },
      orderBy: { assignedAt: "desc" },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
