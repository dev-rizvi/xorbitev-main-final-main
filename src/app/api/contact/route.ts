import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.contactLead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact leads', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const lead = await prisma.contactLead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        focus: data.focus,
        requirements: data.requirements,
      }
    });
    
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: 'Failed to save contact lead' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, status } = data;
    
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    const lead = await prisma.contactLead.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Contact PUT error:', error);
    return NextResponse.json({ error: 'Failed to update contact status' }, { status: 500 });
  }
}
