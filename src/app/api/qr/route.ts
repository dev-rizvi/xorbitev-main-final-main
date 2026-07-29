import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkRange = searchParams.get('checkRange');
    
    if (checkRange === 'true') {
      const prefix = searchParams.get('prefix');
      const start = parseInt(searchParams.get('start') || '0');
      const end = parseInt(searchParams.get('end') || '0');

      const existing = await prisma.generatedQR.findFirst({
        where: {
          prefix: prefix || '',
          number: {
            gte: start,
            lte: end
          }
        }
      });

      return NextResponse.json({ exists: !!existing });
    }

    console.log('Fetching QR history...');
    const qrs = await prisma.generatedQR.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${qrs.length} QR codes`);
    return NextResponse.json(qrs);
  } catch (error) {
    console.error('QR GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch QR codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { qrs } = await request.json(); // Array of { qrCode, prefix, number }
    
    if (!qrs || !Array.isArray(qrs)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Use createMany for high-speed bulk insertion (Single DB request)
    const result = await prisma.generatedQR.createMany({
      data: qrs,
      skipDuplicates: true 
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('QR POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to save QR codes', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
