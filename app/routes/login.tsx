import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { redirect, json } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { createUserSession, getUserId } from '../utils/session.server';
import { verifyLogin } from '~/models/user.server';
import { useEffect, useRef } from 'react';

type ActionData = {
  fields?: {
    email: string;
    password: string;
    redirectTo: string;
  };
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  formError?: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

const validateEmail = (email: string) => {
  if (email.length < 4 || !email.includes('@')) {
    return `Email is invalid`;
  }
};

const validatePassword = (password: string) => {
  if (password.length < 6) {
    return password.length === 0
      ? `Password is required`
      : `Password is too short`;
  }
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export let action: ActionFunction = async ({ request }) => {
  let data = await request.formData();
  let email = data.get('email');
  let password = data.get('password');
  let redirectTo = data.get('redirectTo');
  if (
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: `Form submitted incorrectly`,
    });
  }

  let fields = { email, password, redirectTo };
  let fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  let user = await verifyLogin(email, password);

  if (!user)
    return badRequest({ formError: `Invalid email or password`, fields });

  return createUserSession({ request, userId: user.id, redirectTo });
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const actionData = useActionData<ActionData>();

  return (
    <section className='w-full pt-20'>
      <Form
        method='post'
        className='w-[90vw] max-w-md mx-auto bg-white rounded p-8 ring-1 ring-[#bcd1d1] focus:bg-red-500'
      >
        <div className='mb-8'>
          <label className='mb-2 block font-semibold' htmlFor='email-input'>
            Email
          </label>
          <div>
            <input
              type='email'
              id='email-input'
              name='email'
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-errormessage={
                actionData?.fieldErrors?.email ? 'email-error' : undefined
              }
              required
              className='w-full border p-2 rounded appearance-none text-slate-700 mb-1'
            />
            {actionData?.fieldErrors?.email ? (
              <p role='alert' id='email-error' className='text-sm text-red-500'>
                {actionData.fieldErrors.email}
              </p>
            ) : null}
          </div>
        </div>
        <div className='mb-8'>
          <label className='mb-2 block font-semibold' htmlFor='password-input'>
            Password
          </label>
          <div>
            <input
              type='password'
              id='password-input'
              name='password'
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
              required
              className='w-full border p-2 rounded text-slate-700 mb-1'
            />
            {actionData?.fieldErrors?.password ? (
              <p
                role='alert'
                id='password-error'
                className='text-sm text-red-500'
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
        </div>
        {actionData?.formError ? (
          <p
            role='alert'
            id='authentication-error'
            className='text-red-500 font-medium'
          >
            {actionData.formError}
          </p>
        ) : null}
        <input type='hidden' value={redirectTo} name='redirectTo' />
        <button
          type='submit'
          className='bg-yellow-400 p-2 col-span-2 rounded mb-4 w-full '
        >
          Login
        </button>
      </Form>
    </section>
  );
}
