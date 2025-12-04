import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// утилита для объединения классов
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
