import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: 'global' }
    });
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: 'global',
          companyName: 'XOrbit EV',
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'global' },
      update: {
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        logo: data.logo,
        lastQRNumber: data.lastQRNumber,
      },
      create: {
        id: 'global',
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        logo: data.logo,
        lastQRNumber: data.lastQRNumber,
      }
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
