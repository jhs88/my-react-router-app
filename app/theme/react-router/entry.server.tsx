/* eslint-disable prefer-const */
/**
 * By default, React Router will handle generating the HTTP Response for you. You are free to delete this file if you'd
 * like to, but if you ever want it revealed again, you can run `npx react-router reveal` ✨ For more information, see
 * https://reactrouter.com/explanation/special-files#entryservertsx
 */

import { PassThrough } from "node:stream";

import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import { createEmotionCache, theme } from "~/theme";
import ServerStyleContext from "~/theme/server.context";

// Reject/cancel all pending promises after 5 seconds
export const streamTimeout = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const cache = createEmotionCache();
  const { renderStylesToNodeStream, extractCritical } =
    createEmotionServer(cache);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    let readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <ServerStyleContext.Provider value={null}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ServerRouter context={routerContext} url={request.url} />
          </ThemeProvider>
        </CacheProvider>
      </ServerStyleContext.Provider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          // Pipe Emotion styles into the body stream
          // const styles = renderStylesToNodeStream();
          // styles.pipe(body, { end: false });
          // Stream the critical CSS into the PassThrough stream
          renderStylesToNodeStream().pipe(body); // emotion does not support renderToPipeableStream yet

          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
}
