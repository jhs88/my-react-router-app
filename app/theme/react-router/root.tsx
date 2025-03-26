import { withEmotionCache } from "@emotion/react";
import { Container } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";

import { ErrorFallback } from "~/components/ErrorFallback";
import appStylesHref from "~/styles.css?url";
import { getMuiLinks, theme } from "~/theme";
import ClientStyleContext from "~/theme/client.context";
import ServerStyleContext from "~/theme/server.context";

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { name: "theme-color", content: theme.palette.primary.main },
];

export const links: LinksFunction = () => [
  ...getMuiLinks(),
  { rel: "stylesheet", href: appStylesHref },
];

const Document = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const reinjectStylesRef = useRef(true);

    // Only executed on client
    // When a top level ErrorBoundary or CatchBoundary are rendered,
    // the document head gets removed, so we have to create the style tags
    useEffect(() => {
      if (!reinjectStylesRef.current) return;

      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // ensure we only do this once per mount
      reinjectStylesRef.current = false;
    }, [clientStyleData, emotionCache.sheet]);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  },
);

export function Layout({ children }: { children: React.ReactNode }) {
  return <Document>{children}</Document>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App(_: Route.ComponentProps) {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <Container>
      <ErrorFallback {...{ error }} />
    </Container>
  );
}
