import { BookmarkFunction } from 'function';
import { hc } from 'hono/client';

export const client = hc<BookmarkFunction>(
  process.env.FUNCTION_URL || 'http://localhost:3001',
);
