'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

export default function Home() {
  const features = [
    {
      icon: '📊',
      title: 'Управление оценками',
      description: 'Простой и быстрый ввод оценок с автоматическим расчетом среднего балла',
    },
    {
      icon: '👥',
      title: 'Управление группами',
      description: 'Организация студентов по группам и предметам',
    },
    {
      icon: '📈',
      title: 'Отчеты и аналитика',
      description: 'Детальные отчеты успеваемости с экспортом в CSV',
    },
    {
      icon: '🔐',
      title: 'Разграничение доступа',
      description: 'Роли для студентов, преподавателей и администраторов',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* hero секция */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* дополнительные эффекты свечения */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="animate-fade-in-up mb-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Электронный
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                журнал
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Современная система учета успеваемости студентов с интуитивным интерфейсом
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/login">
              <Button variant="primary" size="lg" className="px-10 py-4 text-lg shadow-2xl">
                Войти в систему
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="px-10 py-4 text-lg">
              Узнать больше
            </Button>
          </div>

          {/* демо-данные */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Card className="text-center p-6 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                150+
              </div>
              <div className="text-sm text-gray-600">Студентов</div>
            </Card>
            <Card className="text-center p-6 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                12
              </div>
              <div className="text-sm text-gray-600">Предметов</div>
            </Card>
            <Card className="text-center p-6 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                8
              </div>
              <div className="text-sm text-gray-600">Групп</div>
            </Card>
          </div>
        </div>

        {/* стрелка вниз */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* секция возможностей */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Возможности системы
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Все необходимые инструменты для эффективного управления учебным процессом
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center glow">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Начните работу сегодня
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к современной системе управления успеваемостью
            </p>
            <Link href="/login">
              <Button variant="primary" size="lg" className="px-12 py-4 text-lg shadow-2xl">
                Войти в систему
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* footer */}
      <footer className="py-12 px-6 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2025 Электронный журнал. Все права защищены.</p>
        </div>
      </footer>
    </main>
  );
}

