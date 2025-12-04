'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { GradeCircle } from '@/app/components/GradeCircle';
import { Badge } from '@/app/components/Badge';

interface Grade {
  id: number;
  score: number;
  date: string;
  type: string;
}

interface SubjectWithGrades {
  id: number;
  name: string;
  grades: Grade[];
}

export default function StudentProfile() {
  const [subjects, setSubjects] = useState<SubjectWithGrades[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/grades')
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      });
  }, []);

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

  // расчет общей статистики
  const calculateOverallStats = () => {
    const allGrades = subjects.flatMap(s => s.grades);
    if (allGrades.length === 0) return { average: 0, total: 0, excellent: 0, good: 0 };
    
    const sum = allGrades.reduce((acc, g) => acc + g.score, 0);
    const average = sum / allGrades.length;
    const excellent = allGrades.filter(g => g.score === 5).length;
    const good = allGrades.filter(g => g.score === 4).length;
    
    return {
      average: average.toFixed(2),
      total: allGrades.length,
      excellent,
      good,
    };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-500">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* header */}
      <Card className="mb-8 animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              С
            </div>
            <div>
              <CardTitle className="text-3xl md:text-4xl mb-1">
                Личный кабинет
              </CardTitle>
              <p className="text-gray-500">Моя успеваемость</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 text-center hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {stats.average}
          </div>
          <div className="text-sm text-gray-600">Средний балл</div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Всего оценок</div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            {stats.excellent}
          </div>
          <div className="text-sm text-gray-600">Отлично (5)</div>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {stats.good}
          </div>
          <div className="text-sm text-gray-600">Хорошо (4)</div>
        </Card>
      </div>

      {/* предметы */}
      <div className="space-y-6">
        {subjects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Нет данных об оценках
            </h3>
            <p className="text-gray-500">
              Оценки появятся после того, как преподаватели начнут их выставлять
            </p>
          </Card>
        ) : (
          subjects.map((subject, index) => {
            const avg = calculateAverage(subject.grades);
            const final = subject.grades.length > 0 ? calculateFinal(avg) : null;

            return (
              <Card
                key={subject.id}
                className="p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* предмет */}
                  <div className="lg:w-1/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {subject.name}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <Badge variant="primary">
                        {subject.grades.length} {subject.grades.length === 1 ? 'оценка' : 'оценок'}
                      </Badge>
                      {avg >= 4.5 && (
                        <Badge variant="success">Отлично</Badge>
                      )}
                    </div>
                  </div>

                  {/* оценки */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {subject.grades.length > 0 ? (
                        subject.grades.map((grade) => (
                          <GradeCircle
                            key={grade.id}
                            grade={grade.score}
                            date={grade.date}
                          />
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          Оценок пока нет
                        </span>
                      )}
                    </div>
                  </div>

                  {/* статистика */}
                  <div className="lg:w-1/5 flex gap-6 lg:justify-end">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Средний
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {subject.grades.length > 0 ? avg.toFixed(2) : '—'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Итоговая
                      </div>
                      {final !== null ? (
                        <GradeCircle grade={final} size="lg" />
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">—</div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

