'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { Input } from '@/app/components/Input';
import { Button } from '@/app/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // перенаправление на основе роли
        if (data.role === 'teacher') router.push('/teacher/grades');
        else if (data.role === 'student') router.push('/student/profile');
        else if (data.role === 'admin') router.push('/admin/users');
        else router.push('/');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* дополнительные эффекты фона */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <Card className="p-8 md:p-10">
          <CardHeader>
            <div className="text-center mb-2">
              <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-center text-3xl mb-2">
              Вход в систему
            </CardTitle>
            <p className="text-center text-gray-500 text-sm">
              Электронный журнал успеваемости
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-600 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eljur.local"
                required
                disabled={loading}
              />

              <Input
                type="password"
                label="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Вход...
                  </div>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className="text-center text-sm text-gray-500">
                Тестовые аккаунты для демонстрации
              </p>
              <div className="mt-3 space-y-2 text-xs text-gray-400">
                <div className="flex justify-between px-2">
                  <span>Учитель:</span>
                  <span className="font-mono">teacher@eljur.local / TeacherPass123</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Студент:</span>
                  <span className="font-mono">student@eljur.local / StudentPass123</span>
                </div>
                <div className="flex justify-between px-2">
                  <span>Админ:</span>
                  <span className="font-mono">admin@eljur.local / AdminPass123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Электронный журнал
        </p>
      </div>
    </div>
  );
}

