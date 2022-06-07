import { LoaderFunction, redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { getUserId, requireUserId } from '~/utils/session.server';

type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
};

type LoaderData = {
  list: Medicine[];
};

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await requireUserId(request);
  // if (typeof userId !== 'string') return redirect('/login');
  let list = await db.medicine.findMany({
    where: { userId: userId },
    select: { id: true, name: true, dosage: true, frequency: true },
  });

  return json({ list });
};

export default function Index() {
  return (
    <section className='p-4 flex flex-col gap-y-8 items-center'>
      <h2 className='mt-8 w-full text-center text-2xl font-semibold leading-tight tracking-widest text-indigo-900 uppercase '>
        Your Account
      </h2>
      <Link
        to='/medication'
        className='bg-cyan-900 hover:bg-cyan-700 text-white font-semibold px-4 py-3 rounded-lg flex items-center justify-center'
      >
        See all medication
      </Link>
    </section>
  );
}

export function ErrorBoundary() {
  return (
    <section className='h-full pt-8'>
      <div className='w-1/2 mx-auto text-center'>
        <h3 className='font-semibold text-2xl leading-8 '>
          Sorry about that, something went wrong!
        </h3>
      </div>
    </section>
  );
}
