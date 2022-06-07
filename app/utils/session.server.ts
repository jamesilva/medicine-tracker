import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getUserById, User } from '../models/user.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET must be set');

const storage = createCookieSessionStorage({
  cookie: {
    name: 'MT_session',
    // secure: true,
    sameSite: 'strict',
    secrets: [sessionSecret],
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function getUserSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return storage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User['id'] | undefined> {
  const userSession = await getUserSession(request);
  const userId = userSession.get('userId');
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;
  const user = await getUserById(userId);
  if (user) return { email: user.email, id: user.id };
  throw await logout({ request });
}

export async function createUserSession({
  request,
  userId,
  redirectTo,
}: {
  request: Request;
  userId: User['id'];
  redirectTo: string;
}) {
  const session = await getUserSession(request);
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function logout({ request }: { request: Request }) {
  const session = await getUserSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
