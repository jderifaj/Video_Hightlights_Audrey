import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from './lib/auth';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/admin')) {
    const token = context.cookies.get('session')?.value;
    const user = token ? verifySessionToken(token) : null;
    if (!user) {
      return context.redirect('/login');
    }
  }

  return next();
});
