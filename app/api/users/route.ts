import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Получить всех пользователей
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Создать пользователя
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    // Создаем связанные сущности
    if (role === 'teacher') {
      await prisma.teacher.create({ data: { userId: user.id } });
    } else if (role === 'student') {
      // Для студента нужна группа, пока ставим null или дефолтную
      // В реальном приложении нужно выбирать группу при создании
      await prisma.student.create({ data: { userId: user.id } });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'User already exists or error' }, { status: 500 });
  }
}

// Удалить пользователя
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const userId = parseInt(id);
    
    // Сначала удаляем связанные записи
    await prisma.grade.deleteMany({ where: { student: { userId } } });
    await prisma.student.deleteMany({ where: { userId } });
    await prisma.teacher.deleteMany({ where: { userId } });
    
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
