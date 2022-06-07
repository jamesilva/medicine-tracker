import type { Medicine, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export type { Medicine } from '@prisma/client';

export async function addMedicine({
  name,
  dosage,
  frequency,
  userId,
}: Pick<Medicine, 'name' | 'dosage' | 'frequency'> & { userId: User['id'] }) {
  return db.medicine.create({
    data: {
      name,
      dosage,
      frequency,
      userId,
    },
  });
}

export async function editMedicine({
  id,
  name,
  dosage,
  frequency,
}: Pick<Medicine, 'id' | 'name' | 'dosage' | 'frequency'>) {
  return db.medicine.update({
    where: { id },
    data: { name, dosage, frequency },
  });
}

export async function deleteMedicine({
  id,
  userId,
}: {
  id: Medicine['id'];
  userId: User['id'];
}) {
  return db.medicine.deleteMany({ where: { id, userId } });
}

export async function getMedicine({
  id,
  userId,
}: {
  id: Medicine['id'];
  userId: User['id'];
}) {
  return db.medicine.findFirst({ where: { id, userId } });
}

export async function getMedicineList({ userId }: { userId: User['id'] }) {
  return db.medicine.findMany({
    where: { userId },
    select: { id: true, name: true, dosage: true, frequency: true },
    orderBy: { updatedAt: 'desc' },
  });
}
