'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { Select } from '@/app/components/Select';
import { Button } from '@/app/components/Button';
import { GradeCircle } from '@/app/components/GradeCircle';

interface Group {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface ReportItem {
  id: number;
  name: string;
  grades: string;
  average: string;
  final: number | string;
}

export default function ReportsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/teacher/init')
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups);
        setSubjects(data.subjects);
      });
  }, []);

  useEffect(() => {
    if (selectedGroup && selectedSubject) {
      setLoading(true);
      fetch(`/api/reports?groupId=${selectedGroup}&subjectId=${selectedSubject}`)
        .then((res) => res.json())
        .then((data) => {
          setReport(data);
          setLoading(false);
        });
    }
  }, [selectedGroup, selectedSubject]);

  const downloadCSV = () => {
    if (report.length === 0) return;

    const headers = ['Студент', 'Оценки', 'Средний балл', 'Итоговая'];
    const rows = report.map(item => [
      item.name,
      `"${item.grades}"`,
      item.average,
      item.final
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${selectedGroup}_${selectedSubject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* header */}
      <Card className="mb-8 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl mb-2">
            Отчеты успеваемости
          </CardTitle>
          <p className="text-gray-500">Сводная информация и экспорт данных</p>
        </CardHeader>
      </Card>

      {/* фильтры */}
      <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
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

            <div className="flex items-end">
              <Button
                onClick={downloadCSV}
                disabled={!selectedGroup || !selectedSubject || report.length === 0}
                variant="primary"
                className="w-full"
              >
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Скачать CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-500">Формирование отчета...</p>
        </div>
      )}

      {/* таблица отчета */}
      {!loading && report.length > 0 && (
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50">
                    <th className="text-left p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Студент
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Оценки
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Средний
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Итоговая
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {report.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.grades.split(',').map((grade, idx) => {
                            const score = parseInt(grade.trim());
                            return !isNaN(score) && score >= 2 && score <= 5 ? (
                              <GradeCircle key={idx} grade={score} size="sm" />
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-lg font-semibold text-gray-800">
                          {item.average}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {typeof item.final === 'number' && (
                          <GradeCircle grade={item.final} size="md" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* пустое состояние */}
      {!loading && !selectedGroup && !selectedSubject && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Выберите параметры отчета
            </h3>
            <p className="text-gray-500">
              Используйте фильтры выше для формирования отчета успеваемости
            </p>
          </div>
        </Card>
      )}

      {/* нет данных */}
      {!loading && selectedGroup && selectedSubject && report.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-lg">
            Нет данных для отображения
          </div>
        </Card>
      )}
    </div>
  );
}

