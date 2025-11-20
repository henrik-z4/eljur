import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: 'asc' },
    });
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ groups, subjects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
