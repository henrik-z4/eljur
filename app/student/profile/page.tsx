'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/app/components/GlassCard';

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
  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return (sum / grades.length).toFixed(2);
  };

  // расчет итоговой оценки
  const calculateFinal = (avg: number) => {
    if (avg >= 4.5) return 5;
    if (avg >= 3.5) return 4;
    if (avg >= 2.5) return 3;
    return 2;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <GlassCard className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Личный кабинет
        </h1>
        <p className="text-gray-500">Мои оценки</p>
      </GlassCard>

      <div className="grid gap-6">
        {subjects.map((subject) => {
          const avg = parseFloat(calculateAverage(subject.grades) as string);
          const final = calculateFinal(avg);

          return (
            <GlassCard key={subject.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-1/4">
                  <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                </div>

                <div className="flex-1 flex flex-wrap gap-2">
                  {subject.grades.length > 0 ? (
                    subject.grades.map((grade) => (
                      <div
                        key={grade.id}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 border border-gray-200 shadow-sm text-gray-800 font-medium"
                        title={new Date(grade.date).toLocaleDateString()}
                      >
                        {grade.score}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Нет оценок</span>
                  )}
                </div>

                <div className="flex gap-8 md:w-1/3 justify-end">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Средний</div>
                    <div className="text-2xl font-bold text-gray-800">{avg || '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Итог</div>
                    <div className={`text-3xl font-bold ${
                      final === 5 ? 'text-green-500' :
                      final === 4 ? 'text-blue-500' :
                      final === 3 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {subject.grades.length > 0 ? final : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
