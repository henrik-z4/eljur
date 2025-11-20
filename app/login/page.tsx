'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/app/components/GlassCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

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
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Вход в систему
        </h2>
        <p className="text-center text-gray-500 mb-8">Электронный журнал</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/50"
              placeholder="name@eljur.local"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500/50"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="glass-button glass-button-primary w-full font-bold py-3 px-4 rounded-lg mt-4"
          >
            Войти
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
