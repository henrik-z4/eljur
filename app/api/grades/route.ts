import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// получение оценок для группы по предмету
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get('groupId');
  const subjectId = searchParams.get('subjectId');

  if (!groupId || !subjectId) {
    return NextResponse.json({ error: 'Missing groupId or subjectId' }, { status: 400 });
  }

  try {
    // получаем студентов группы и их оценки по предмету
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

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// создание новой оценки
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, subjectId, score, type, date } = body;

    const grade = await prisma.grade.create({
      data: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        score: parseInt(score),
        type: type || 'homework',
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
