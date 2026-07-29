import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealer = await prisma.dealer.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            battery: true
          }
        },
        repairs: {
          include: {
            battery: true
          }
        },
        assignedUnits: {
          include: {
            model: true
          }
        }
      }
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer);
  } catch (error) {
    console.error("Dealer fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch dealer" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.dealer.update({
      where: { id },
      data: { deletedAt: new Date(), status: "inactive" }
    });
    return NextResponse.json({ message: "Dealer deactivated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete dealer" }, { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const updated = await prisma.dealer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
      }
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Dealer update error:", error);
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 });
  }
}
