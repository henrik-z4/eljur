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
      `"${item.grades}"`, // escape commas in grades
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
    <div className="min-h-screen p-8">
      <GlassCard className="mb-8">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Отчеты успеваемости
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Группа</label>
            <select
              className="glass-input w-full px-4 py-2 rounded-lg"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Выберите группу</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Предмет</label>
            <select
              className="glass-input w-full px-4 py-2 rounded-lg"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Выберите предмет</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={downloadCSV}
            disabled={!selectedGroup || !selectedSubject || report.length === 0}
            className="glass-button glass-button-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
          >
            Скачать CSV
          </button>
        </div>
      </GlassCard>

      {loading && <div className="text-center text-gray-500">Загрузка...</div>}

      {!loading && report.length > 0 && (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Студент</th>
                  <th className="p-4 font-semibold text-gray-600">Оценки</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Средний</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Итог</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.map((item) => (
                  <tr key={item.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                    <td className="p-4 text-gray-600">{item.grades}</td>
                    <td className="p-4 text-right font-mono text-gray-800">{item.average}</td>
                    <td className={`p-4 text-right font-bold ${
                      item.final === 5 ? 'text-green-600' :
                      item.final === 4 ? 'text-blue-600' :
                      item.final === 3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.final}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
