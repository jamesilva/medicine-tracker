import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const james = await db.user.create({
    data: {
      email: 'james@james.com',
      passwordHash:
        '$2y$10$hram9ys.EvHDcLpeCvxYu..0mYCmk7SHyGYXsqVY6yzNebA2o28HC',
    },
  });
  await Promise.all(
    getMedicine().map((medicine) => {
      return db.medicine.create({ data: { ...medicine, userId: james.id } });
    })
  );
}

seed();

type Meds = {
  name: string;
  dosage: string;
  frequency: string;
};

function getMedicine(): Meds[] {
  return [
    { name: 'Viscotin', dosage: '2 mg', frequency: '2 x day' },
    { name: 'Brufen', dosage: '150 mg', frequency: '1 x day' },
    { name: 'Vigantol', dosage: '1 mg', frequency: '1 x day' },
  ];
}
