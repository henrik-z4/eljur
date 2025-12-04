'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Select } from '@/app/components/Select';
import { Button } from '@/app/components/Button';
import { Badge } from '@/app/components/Badge';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('student');
      fetchUsers();
    } else {
      alert('Ошибка при создании пользователя');
    }
    setSubmitting(false);
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Вы уверены? Это удалит пользователя и все его данные.')) {
      const res = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
      }
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'purple';
      case 'teacher': return 'primary';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'teacher': return 'Преподаватель';
      case 'student': return 'Студент';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* header */}
      <Card className="mb-8 animate-fade-in-up">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl mb-2">
                Управление пользователями
              </CardTitle>
              <p className="text-gray-500">Административная панель</p>
            </div>
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
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* форма создания */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Новый пользователь</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <Input
                  label="ФИО"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  required
                  disabled={submitting}
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@eljur.local"
                  required
                  disabled={submitting}
                />

                <Input
                  label="Пароль"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={submitting}
                />

                <Select
                  label="Роль"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={submitting}
                >
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                  <option value="admin">Администратор</option>
                </Select>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Создание...' : 'Создать пользователя'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* список пользователей */}
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Пользователи ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-gray-500">Загрузка...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  Пользователи не найдены
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all border border-white/20"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="ml-4"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

