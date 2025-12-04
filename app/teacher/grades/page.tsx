'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { Select } from '@/app/components/Select';
import { Button } from '@/app/components/Button';
import { GradeCircle } from '@/app/components/GradeCircle';
import { Badge } from '@/app/components/Badge';

interface Group {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  score: number;
  type: string;
  date: string;
}

interface Student {
  id: number;
  userId: number;
  user: { name: string };
  grades: Grade[];
}

export default function TeacherGrades() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // загрузка начальных данных
  useEffect(() => {
    fetch('/api/teacher/init')
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups);
        setSubjects(data.subjects);
      });
  }, []);

  // загрузка студентов и оценок
  useEffect(() => {
    if (selectedGroup && selectedSubject) {
      setLoading(true);
      fetch(`/api/grades?groupId=${selectedGroup}&subjectId=${selectedSubject}`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);
          setLoading(false);
        });
    }
  }, [selectedGroup, selectedSubject]);

  // добавление оценки
  const handleAddGrade = async (studentId: number) => {
    const input = prompt('Введите оценку (2-5):');
    if (!input) return;

    const score = Number(input);
    if (isNaN(score) || score < 2 || score > 5) {
      alert('Ошибка: Оценка должна быть числом от 2 до 5');
      return;
    }

    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        subjectId: selectedSubject,
        score,
        type: 'homework',
      }),
    });

    if (res.ok) {
      const newGrade = await res.json();
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, grades: [...s.grades, newGrade] } : s
        )
      );
    }
  };

  // удаление оценки
  const handleGradeClick = async (gradeId: number) => {
    if (confirm('Удалить оценку?')) {
      const res = await fetch(`/api/grades/${gradeId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            grades: s.grades.filter((g) => g.id !== gradeId),
          }))
        );
      }
    }
  };

  // расчет среднего балла
  const calculateAverage = (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return sum / grades.length;
  };

  // расчет итоговой оценки
  const calculateFinal = (avg: number) => {
    if (avg >= 4.5) return 5;
    if (avg >= 3.5) return 4;
    if (avg >= 2.5) return 3;
    return 2;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* header */}
      <Card className="mb-8 animate-fade-in-up">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl mb-2">
                Журнал успеваемости
              </CardTitle>
              <p className="text-gray-500">Управление оценками студентов</p>
            </div>
            <div className="flex gap-3">
              <Link href="/reports">
                <Button variant="secondary">
                  <svg
                    className="w-5 h-5 mr-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Отчеты
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* фильтры */}
      <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Группа"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Выберите группу</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Select>

            <Select
              label="Предмет"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Выберите предмет</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Загрузка данных...</p>
        </div>
      )}

      {/* список студентов */}
      {!loading && selectedGroup && selectedSubject && students.length === 0 && (
        <Card className="text-center p-12">
          <div className="text-gray-400 text-lg">
            Студенты не найдены
          </div>
        </Card>
      )}

      {!loading && selectedGroup && selectedSubject && students.length > 0 && (
        <div className="space-y-4">
          {students.map((student, index) => {
            const avg = calculateAverage(student.grades);
            const final = calculateFinal(avg);

            return (
              <Card
                key={student.id}
                className="p-6 hover:scale-[1.01] transition-transform animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* имя студента */}
                  <div className="lg:w-1/4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {student.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {student.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {student.grades.length} оценок
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* оценки */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {student.grades.map((grade) => (
                        <GradeCircle
                          key={grade.id}
                          grade={grade.score}
                          date={grade.date}
                          clickable
                          onClick={() => handleGradeClick(grade.id)}
                        />
                      ))}
                      <button
                        onClick={() => handleAddGrade(student.id)}
                        className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all text-gray-400 hover:text-purple-600 flex items-center justify-center font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* статистика */}
                  <div className="lg:w-1/5 flex gap-6 lg:justify-end">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Средний
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {avg.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Итоговая
                      </div>
                      <GradeCircle grade={final} size="lg" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* пустое состояние */}
      {!selectedGroup && !selectedSubject && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Выберите группу и предмет
            </h3>
            <p className="text-gray-500">
              Используйте фильтры выше для отображения журнала успеваемости
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

