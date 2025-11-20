import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('groupId');
  const subjectId = searchParams.get('subjectId');

  if (!groupId || !subjectId) {
    return NextResponse.json({ error: 'Missing groupId or subjectId' }, { status: 400 });
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        groupId: parseInt(groupId),
      },
      include: {
        user: {
          select: { name: true },
        },
        grades: {
          where: {
            subjectId: parseInt(subjectId),
          },
          orderBy: { date: 'asc' },
        },
      },
    });

    // формируем отчет
    const report = students.map((student: any) => {
      const grades = student.grades.map((g: any) => g.score);
      const sum = grades.reduce((a: number, b: number) => a + b, 0);
      const avg = grades.length > 0 ? sum / grades.length : 0;
      
      let final = 2;
      if (avg >= 4.5) final = 5;
      else if (avg >= 3.5) final = 4;
      else if (avg >= 2.5) final = 3;

      return {
        id: student.id,
        name: student.user.name,
        grades: grades.join(', '),
        average: avg.toFixed(2),
        final: grades.length > 0 ? final : '-',
      };
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
