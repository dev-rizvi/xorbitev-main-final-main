import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalBatteries, totalDealers, totalAssignments, totalRepairs] = await Promise.all([
      prisma.batteryDetail.count({ where: { deletedAt: null } }),
      prisma.dealer.count({ where: { deletedAt: null } }),
      prisma.batteryAssignment.aggregate({
        _sum: { quantity: true }
      }),
      prisma.batteryRepair.aggregate({
        _sum: { quantity: true }
      })
    ]);

    // Fetch recent activities
    const [recentAssignments, recentRepairs] = await Promise.all([
      prisma.batteryAssignment.findMany({
        take: 5,
        orderBy: { assignedAt: 'desc' },
        include: {
          dealer: true,
          battery: true
        }
      }),
      prisma.batteryRepair.findMany({
        take: 5,
        orderBy: { receivedAt: 'desc' },
        include: {
          dealer: true,
          battery: true
        }
      })
    ]);

    const activities = [
      ...recentAssignments.map((a: any) => ({
        id: a.id,
        type: 'assignment',
        title: `Inventory Deployed to ${a.dealer.name}`,
        description: `${a.quantity}x ${a.battery.name} dispatched`,
        time: a.assignedAt
      })),
      ...recentRepairs.map((r: any) => ({
        id: r.id,
        type: 'repair',
        title: `Fault Reported by ${r.dealer?.name || 'Direct / Internal'}`,
        description: `${r.quantity}x ${r.battery.name} - ${r.issue || r.problemRemark || 'No details'}`,
        time: r.receivedAt
      }))
    ].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return NextResponse.json({
      stats: {
        batteries: totalBatteries,
        dealers: totalDealers,
        activeUnits: totalAssignments._sum.quantity || 0,
        faultyUnits: totalRepairs._sum.quantity || 0
      },
      activities
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
