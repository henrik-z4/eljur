const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // чистим
  await prisma.grade.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.group.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  // создаем админа (бан)
  const adminHash = await bcrypt.hash('AdminPass123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@eljur.local',
      passwordHash: adminHash,
      name: 'Администратор',
      role: 'admin',
    },
  });

  // создаем преподавателя
  const teacherHash = await bcrypt.hash('TeacherPass123', 10);
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@eljur.local',
      passwordHash: teacherHash,
      name: 'Елена Алексеевна Митрошенкова',
      role: 'teacher',
    },
  });
  await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
    },
  });

  // создаем группу
  const group = await prisma.group.create({
    data: {
      name: 'ТИП-51',
      course: 3,
    },
  });
  
  // создаем студента
  const studentHash = await bcrypt.hash('StudentPass123', 10);
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@eljur.local',
      passwordHash: studentHash,
      name: 'Рубаник Виктор',
      role: 'student',
    },
  });
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      groupId: group.id,
    },
  });

  // создаем предмет
  const subject = await prisma.subject.create({
    data: {
      name: 'Технология разработки программного обеспечения',
    },
  });

  // создаем оценку
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
