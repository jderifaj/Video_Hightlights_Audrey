import { a6 as defineMiddleware, af as sequence } from './chunks/sequence_DBLTLYBt.mjs';
import '@astrojs/internal-helpers/path';
import 'piccolore';
import 'clsx';
import { v as verifySessionToken } from './chunks/auth_BA-UNyac.mjs';

const onRequest$1 = defineMiddleware((context, next) => {
  const { pathname } = context.url;
  if (pathname.startsWith("/admin")) {
    const token = context.cookies.get("session")?.value;
    const user = token ? verifySessionToken(token) : null;
    if (!user) {
      return context.redirect("/login");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
