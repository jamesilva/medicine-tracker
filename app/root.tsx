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
  useSubmit,
} from '@remix-run/react';
import React, { useEffect } from 'react';

import { getUser } from './utils/session.server';
import type { User } from '~/models/user.server';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuLink,
  MenuPopover,
  MenuItems,
} from '@reach/menu-button';
import Rect, { useRect } from '@reach/rect';
import { positionRight } from '@reach/popover';

import styles from './tailwind.css';
// import menuStyles from '@reach/menu-button/styles.css';

type LoaderData = {
  user: Pick<User, 'id' | 'email'> | null;
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

  return json<LoaderData>({ user });
};

export default function App() {
  const { user } = useLoaderData<LoaderData>();

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

function UserPopover({ children }: { children: React.ReactNode }) {
  const [observe, setObserve] = React.useState(true);
  let submit = useSubmit();
  // your own ref
  let buttonRef = React.useRef(null);
  let popoverRef = React.useRef(null);
  let buttonRect = useRect(buttonRef);
  return (
    <Menu>
      {({ isExpanded }) => (
        <>
          <MenuButton
            ref={buttonRef}
            className={`text-slate-700 py-2 pl-4 rounded hover:bg-slate-100 focus:bg-slate-100 flex items-center rounded-b-none ${
              isExpanded ? 'bg-slate-100' : 'bg-white'
            }`}
          >
            {children}
          </MenuButton>
          <MenuPopover
            position={() => {
              return {
                width: buttonRect?.width / 1.5,
                right: window.innerWidth - buttonRect?.right,
                top: buttonRect?.bottom,
              };
            }}
          >
            <div
              ref={popoverRef}
              className=' rounded-b bg-white focus:outline-none'
            >
              <MenuItems className='flex flex-col gap-y-2 p-2 focus:outline-1'>
                <MenuLink
                  as={Link}
                  to='/'
                  className='p-2 hover:bg-slate-200 flex justify-end w-full rounded'
                >
                  Account
                </MenuLink>
                <MenuItem
                  className='p-2 hover:bg-slate-200 rounded cursor-pointer w-full flex justify-end '
                  onSelect={() =>
                    submit(null, { method: 'post', action: '/logout' })
                  }
                >
                  Logout
                </MenuItem>
              </MenuItems>
            </div>
          </MenuPopover>
        </>
      )}
    </Menu>
  );
}
