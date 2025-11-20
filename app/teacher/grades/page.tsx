'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/app/components/GlassCard';

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
        type: 'homework', // пока хардкод
      }),
    });

    if (res.ok) {
      // обновляем данные
      const newGrade = await res.json();
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, grades: [...s.grades, newGrade] } : s
        )
      );
    }
  };

  // удаление оценки (по клику)
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

  return (
    <div className="min-h-screen p-8">
      <GlassCard className="mb-8">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Журнал успеваемости
        </h1>
        
        <div className="flex gap-4 mb-4">
          <select
            className="glass-input px-4 py-2 rounded-lg bg-transparent"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="" className="text-black">Выберите группу</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id} className="text-black">
                {g.name}
              </option>
            ))}
          </select>

          <select
            className="glass-input px-4 py-2 rounded-lg bg-transparent"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="" className="text-black">Выберите предмет</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="text-black">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {loading && <div className="text-white text-center">Загрузка...</div>}

      {!loading && selectedGroup && selectedSubject && (
        <div className="grid gap-4">
          {students.map((student) => {
            const avg = parseFloat(calculateAverage(student.grades) as string);
            const final = calculateFinal(avg);

            return (
              <GlassCard key={student.id} className="flex items-center justify-between p-4">
                <div className="w-1/4 font-medium text-lg text-gray-800">{student.user.name}</div>
                
                <div className="flex-1 flex flex-wrap gap-2 px-4">
                  {student.grades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => handleGradeClick(grade.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/80 transition-colors border border-gray-200 shadow-sm text-gray-800 font-medium"
                      title={new Date(grade.date).toLocaleDateString()}
                    >
                      {grade.score}
                    </button>
                  ))}
                  <button
                    onClick={() => handleAddGrade(student.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
                  >
                    +
                  </button>
                </div>

                <div className="w-1/6 text-right">
                  <div className="text-sm text-gray-500">Средний</div>
                  <div className="text-xl font-bold text-gray-800">{avg || '-'}</div>
                </div>
                
                <div className="w-1/6 text-right">
                  <div className="text-sm text-gray-500">Итог</div>
                  <div className={`text-2xl font-bold ${
                    final === 5 ? 'text-green-500' :
                    final === 4 ? 'text-blue-500' :
                    final === 3 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {student.grades.length > 0 ? final : '-'}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
