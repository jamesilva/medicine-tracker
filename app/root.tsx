import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form,
} from '@remix-run/react';
import React, { useEffect } from 'react';

import { getUser } from './utils/session.server';
import type { User } from '~/models/user.server';

// import * as Popover from '@radix-ui/react-popover';
import * as Popover from '@radix-ui/react-dropdown-menu';

import styles from './tailwind.css';

type LoaderData = {
  user: Pick<User, 'id' | 'email'> | null;
  stat: string;
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Medicine Tracker',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  console.log('in loader', user);
  let words = user ? `user` : `no user`;
  return json<LoaderData>({ user, stat: words });
};

export default function App() {
  const { user, stat } = useLoaderData<LoaderData>();
  useEffect(() => {
    console.log('in component ', user, stat);
  }, [user, stat]);

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='text-slate-800 min-h-screen'>
        <nav className='w-full h-20 flex items-center bg-white'>
          <div className='w-[90vw] mx-auto flex justify-between items-center'>
            <Link
              to='/'
              className='font-bold text-xl text-slate-800 hover:text-yellow-700 '
            >
              Medicine Tracker
            </Link>
            <div>
              {user ? (
                <UserPopover>
                  <button
                    type='button'
                    className=' text-slate-700 py-2 pl-4 rounded hover:bg-slate-100 flex items-center'
                  >
                    <span className=' font-semibold mr-2'>{user.email}</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </UserPopover>
              ) : (
                <>
                  {' '}
                  <Link
                    to='/login'
                    className='uppercase text-slate-800 py-2 px-4 font-semibold mr-4 rounded hover:bg-slate-100'
                  >
                    Log in
                  </Link>
                  <Link
                    to='/signup'
                    className='uppercase bg-yellow-400 py-2 px-4 rounded font-semibold hover:bg-yellow-500'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className='w-full h-[calc(100vh_-_5rem)] overflow-y-auto bg-[#e3f6f5]'>
          {/* <main className='w-full grow bg-[#e3f6f5]'> */}
          <div className='w-[90vw] h-full max-w-4xl mx-auto'>
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type Props = {
  children: React.ReactNode;
};

// function UserPopover({ children }: Props) {
//   return (
//     <Popover.Root modal={false}>
//       <Popover.Trigger asChild={true}>{children}</Popover.Trigger>
//       <Popover.Content
//         sideOffset={20}
//         align='end'
//         onCloseAutoFocus={(e) => e.preventDefault()}
//       >
//         <div className='flex flex-col bg-white gap-y-2 w-28 p-4 rounded shadow-md'>
//           <Popover.Item asChild>
//             <Link to='/'>Account</Link>
//           </Popover.Item>
//           <Popover.Item asChild={true}>
//             <form method='post' action='/logout'>
//               <button type='submit'>Log out</button>
//             </form>
//           </Popover.Item>
//         </div>
//       </Popover.Content>
//     </Popover.Root>
//   );
// }

function UserPopover({ children }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content sideOffset={20} align='end'>
        <div className='flex flex-col bg-white gap-y-2 w-28 p-4 rounded shadow-md'>
          <Link to='/'>Account</Link>
          <Form method='post' action='/logout'>
            <button type='submit'>Log out</button>
          </Form>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
