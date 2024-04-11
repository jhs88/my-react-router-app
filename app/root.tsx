import type { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
  useMatches,
  useRouteError,
} from '@remix-run/react';
import { useEffect } from 'react';

import { createEmptyContact, getContacts } from '~/api/data';
import appStylesHref from '~/app.css';
import Layout from '~/components/Layout';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) =>
  (formMethod && formMethod !== 'GET') ??
  currentUrl.toString() !== nextUrl.toString();

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export function links() {
  return [{ rel: 'stylesheet', href: appStylesHref }];
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  console.log(root);
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return json({ contacts, q });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <div className="error-page">
            <h1>{isRouteErrorResponse(error) ? error.status : 500}</h1>
            <p>
              {isRouteErrorResponse(error)
                ? error.data.message ?? error.data
                : error instanceof Error
                ? error.message
                : 'An Unknown error ocurred'}
            </p>
          </div>
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}