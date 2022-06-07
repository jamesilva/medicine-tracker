import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData, Form } from '@remix-run/react';
import { requireUserId } from '~/utils/session.server';

import { deleteMedicine, getMedicineList } from '~/models/medicine.server';
import type { Medicine } from '~/models/medicine.server';

type LoaderData = {
  list: Pick<Medicine, 'id' | 'name' | 'dosage' | 'frequency'>[];
};

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await requireUserId(request);
  let list = await getMedicineList({ userId });

  return json<LoaderData>({ list });
};

export let action: ActionFunction = async ({ request }) => {
  let userId = await requireUserId(request);
  let data = await request.formData();
  let action = data.get('_action');
  if (action === 'delete') {
    let medId = data.get('medId');
    if (!medId || typeof medId !== 'string') {
      return json({ error: 'error with form submission' }, { status: 400 });
    }
    return deleteMedicine({ id: medId, userId });
  }
};

export default function Medication() {
  const { list: medication } = useLoaderData<LoaderData>();
  return (
    <>
      <Outlet />
      <section className='p-4 flex flex-col gap-y-8 items-center'>
        <h2 className='mt-8 w-full text-center text-2xl font-semibold leading-tight tracking-widest text-indigo-900 uppercase '>
          Your Medication
        </h2>
        <div className='max-w-md mx-auto max-h-1/2 overflow-y-auto'>
          {medication.length > 0 ? (
            medication.map((entry) => (
              <article
                key={entry.id}
                className='grid grid-cols-[1fr,2fr,1fr] my-4 p-4 gap-x-4 bg-white rounded-lg hover:shadow-md'
              >
                <h4 className='text-lg font-semibold capitalize'>
                  {entry.name}
                </h4>
                <div className='pl-2'>
                  <p>
                    Dosage: <span>{entry.dosage}</span>
                  </p>
                  <p>
                    Frequency: <span>{entry.frequency}</span>
                  </p>
                </div>
                <div className='flex flex-col items-end gap-y-2'>
                  <Link to={`${entry.id}`} aria-label='edit'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 hover:text-slate-400'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                      <path
                        fillRule='evenodd'
                        d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </Link>
                  <Form method='post'>
                    <input type='hidden' name='medId' value={entry.id} />
                    <button
                      type='submit'
                      aria-label='delete'
                      name='_action'
                      value='delete'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 hover:text-red-700'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </Form>
                </div>
              </article>
            ))
          ) : (
            <p className='block mb-8 text-center'>No data</p>
          )}
          <div>
            <Link
              to='new'
              className='bg-cyan-900 hover:bg-cyan-700 text-white font-semibold px-4 py-3 rounded-lg w-full flex items-center justify-center'
            >
              Add Medication
            </Link>
          </div>
        </div>
      </section>
    </>
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
