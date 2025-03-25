import { Container } from "@mui/material";
import type { LinksFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "react-router";
import type { Route } from "./+types/root";

import { ErrorFallback } from "~/components/ErrorFallback";
import { getMuiLinks, MuiDocument, MuiMeta } from "~/theme";

export const links: LinksFunction = () => [...getMuiLinks()];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <MuiMeta />
        <Links />
      </head>
      <body>
        <MuiDocument>
          <Container>{children}</Container>
        </MuiDocument>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App(_: Route.ComponentProps) {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ErrorFallback {...{ error }} />;
}
