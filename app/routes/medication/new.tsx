import { Form, useNavigate, Link, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type {
  LinksFunction,
  ActionFunction,
  LoaderFunction,
} from '@remix-run/node';

import { requireUserId } from '~/utils/session.server';
import { addMedicine } from '~/models/medicine.server';

import { DialogOverlay, DialogContent } from '@reach/dialog';
import styles from '@reach/dialog/styles.css';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

type ActionData = {
  fields?: {
    name: string;
    dosage: string;
    frequency: string;
  };
  fieldErrors?: {
    name?: string;
    dosage?: string;
    frequency?: string;
  };
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export let action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  let data = await request.formData();
  let name = data.get('name');
  let dosage = data.get('dosage');
  let frequency = data.get('frequency');
  if (
    typeof name !== 'string' ||
    typeof dosage !== 'string' ||
    typeof frequency !== 'string'
  ) {
    return badRequest({ formError: 'form submited incorrectly' });
  }

  let fields = { name, dosage, frequency };
  let fieldErrors = {
    name: name.length === 0 ? `Please provide a name.` : undefined,
    dosage:
      dosage.length === 0 ? `Please insert the dosage to intake.` : undefined,
    frequency:
      frequency.length === 0
        ? `Please indicate how often to take this medication.`
        : undefined,
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const medicine = await addMedicine({ ...fields, userId });
  if (medicine) return redirect('/medication');

  return badRequest({ fields, formError: `Error adding new medicine` });
};

export default function New() {
  let navigate = useNavigate();
  let actionData = useActionData<ActionData>();

  function onClose() {
    navigate('..');
  }

  return (
    <DialogOverlay isOpen={true} onDismiss={onClose}>
      <DialogContent
        aria-label='New Medication'
        style={{ maxWidth: '32rem', width: '90vw' }}
        className='rounded'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>New Medication</h2>
          <button
            type='button'
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
            <div>
              <input
                type='text'
                id='name'
                name='name'
                required
                defaultValue={actionData?.fields?.name}
                aria-invalid={Boolean(actionData?.fieldErrors?.name)}
                aria-errormessage={
                  actionData?.fieldErrors?.name ? 'name-error' : undefined
                }
                className='p-2 w-full border-2 rounded mt-1'
              />
              {actionData?.fieldErrors?.name ? (
                <p
                  role='alert'
                  id='name-error'
                  className='text-sm text-red-500'
                >
                  {actionData.fieldErrors.name}
                </p>
              ) : null}
            </div>
          </div>
          <div className='block'>
            <label
              className='block font-semibold text-slate-700 mt-4'
              htmlFor='dosage'
            >
              Dosage
            </label>
            <div>
              <input
                type='text'
                id='dosage'
                name='dosage'
                required
                defaultValue={actionData?.fields?.dosage}
                aria-invalid={Boolean(actionData?.fieldErrors?.dosage)}
                aria-errormessage={
                  actionData?.fieldErrors?.dosage ? 'dosage-error' : undefined
                }
                className='p-2 w-full border-2 rounded mt-1'
              />
              {actionData?.fieldErrors?.dosage ? (
                <p
                  role='alert'
                  id='dosage-error'
                  className='text-sm text-red-500'
                >
                  {actionData.fieldErrors.dosage}
                </p>
              ) : null}
            </div>
          </div>
          <div className='block'>
            <label
              className='block font-semibold text-slate-700 mt-4'
              htmlFor='frequency'
            >
              Frequency
            </label>
            <div>
              <input
                type='text'
                id='frequency'
                name='frequency'
                required
                defaultValue={actionData?.fields?.frequency}
                aria-invalid={Boolean(actionData?.fieldErrors?.frequency)}
                aria-errormessage={
                  actionData?.fieldErrors?.frequency
                    ? 'frequency-error'
                    : undefined
                }
                className='p-2 w-full border-2 rounded mt-1'
              />
              {actionData?.fieldErrors?.frequency ? (
                <p
                  role='alert'
                  id='frequency-error'
                  className='text-sm text-red-500'
                >
                  {actionData.fieldErrors.frequency}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type='submit'
            className='mt-6 flex items-center justify-center w-full bg-cyan-900 hover:bg-cyan-700 text-white py-2 rounded'
          >
            Add new
          </button>
        </Form>
      </DialogContent>
    </DialogOverlay>
  );
}
