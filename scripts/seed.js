const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clean up
  await prisma.grade.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.group.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminHash = await bcrypt.hash('AdminPass123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@eljur.local',
      passwordHash: adminHash,
      name: 'Администратор',
      role: 'admin',
    },
  });

  // Create Teacher
  const teacherHash = await bcrypt.hash('TeacherPass123', 10);
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@eljur.local',
      passwordHash: teacherHash,
      name: 'Иван Иванович',
      role: 'teacher',
    },
  });
  await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
    },
  });

  // Create Group
  const group = await prisma.group.create({
    data: {
      name: 'ИСП-21',
      course: 2,
    },
  });

  // Create Student
  const studentHash = await bcrypt.hash('StudentPass123', 10);
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@eljur.local',
      passwordHash: studentHash,
      name: 'Петр Петров',
      role: 'student',
    },
  });
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      groupId: group.id,
    },
  });

  // Create Subject
  const subject = await prisma.subject.create({
    data: {
      name: 'Программирование',
    },
  });

  // Create Grade
  await prisma.grade.create({
    data: {
      studentId: student.id,
      subjectId: subject.id,
      score: 5,
      type: 'homework',
    },
  });

  console.log('Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
