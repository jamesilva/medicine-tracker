import { DialogContent, DialogOverlay } from '@reach/dialog';
import { json, redirect } from '@remix-run/node';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { Form, useNavigate, useParams } from '@remix-run/react';

import { requireUserId } from '~/utils/session.server';

import styles from '@reach/dialog/styles.css';
import { useMedication } from '~/useMedication';
import { editMedicine } from '~/models/medicine.server';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export let action: ActionFunction = async ({ request }) => {
  let userId = await requireUserId(request);
  let data = await request.formData();
  let name = data.get('name');
  let dosage = data.get('dosage');
  let frequency = data.get('frequency');
  let medId = data.get('medId');
  if (
    typeof name !== 'string' ||
    typeof dosage !== 'string' ||
    typeof frequency !== 'string' ||
    typeof medId !== 'string'
  ) {
    return json({ formError: 'form submission invalid' }, { status: 400 });
  }
  let medicine = editMedicine({ name, dosage, frequency, id: medId });
  return redirect('/medication');
};

export default function Edit() {
  const { medicationId } = useParams();
  const medication = medicationId ? useMedication(medicationId) : undefined;

  const navigate = useNavigate();

  function onClose() {
    navigate('..');
  }

  return (
    <DialogOverlay isOpen={true} onDismiss={onClose}>
      <DialogContent
        aria-label='Edit Medication'
        style={{ maxWidth: '32rem', width: '90vw' }}
        className='rounded'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-medium '>Edit Medication</h2>
          <button
            type='button'
            aria-label='close'
            onClick={onClose}
            className='flex items-center hover:text-red-700 hover:scale-125'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
        <Form method='post' className='mt-8'>
          <div className='block'>
            <label
              className='block font-semibold text-slate-700'
              htmlFor='name'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              defaultValue={medication?.name}
              spellCheck={false}
              className='p-2 w-full border-2 rounded mt-1'
            />
          </div>
          <div className='block'>
            <label
              className='block font-semibold text-slate-700 mt-4'
              htmlFor='dosage'
            >
              Dosage
            </label>
            <input
              type='text'
              id='dosage'
              name='dosage'
              required
              defaultValue={medication?.dosage}
              className='p-2 w-full border-2 rounded mt-1'
            />
          </div>
          <div className='block'>
            <label
              className='block font-semibold text-slate-700 mt-4'
              htmlFor='frequency'
            >
              Frequency
            </label>
            <input
              type='text'
              id='frequency'
              name='frequency'
              required
              defaultValue={medication?.frequency}
              className='p-2 w-full border-2 rounded mt-1'
            />
          </div>
          <input type='hidden' name='medId' value={medicationId} />
          <button
            type='submit'
            className='mt-4 flex items-center justify-center w-full bg-cyan-900 hover:bg-cyan-700 text-white py-2 rounded'
          >
            Submit
          </button>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
}
