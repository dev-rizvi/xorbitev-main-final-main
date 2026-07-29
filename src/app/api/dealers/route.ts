import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      where: { deletedAt: null },
      include: {
        assignments: {
          include: {
            battery: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(dealers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Creating dealer with body:", body);
    const dealer = await prisma.dealer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      },
    });
    return NextResponse.json(dealer);
  } catch (error) {
    console.error("Dealer creation error:", error);
    return NextResponse.json({ 
      error: "Failed to create dealer", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
