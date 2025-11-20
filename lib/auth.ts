import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) return null;

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}
