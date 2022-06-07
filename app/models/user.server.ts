import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { db } from '~/utils/db.server';

export type { User } from '@prisma/client';

export async function getUserById(id: User['id']) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(email: User['email'], password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return db.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

export async function verifyLogin(email: User['email'], password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  const { passwordHash: _password, ...userWithoutPwd } = user;

  return userWithoutPwd;
}
