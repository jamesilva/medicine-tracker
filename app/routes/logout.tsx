import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { logout } from '~/utils/session.server';

export let loader: LoaderFunction = async () => {
  return redirect('/');
};

export let action: ActionFunction = ({ request }) => {
  return logout({ request });
};
