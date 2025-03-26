/**
 * By default, React Router will handle hydrating your app on the client for you. You are free to delete this file if
 * you'd like to, but if you ever want it revealed again, you can run `npx react-router reveal` ✨ For more information,
 * see https://reactrouter.com/explanation/special-files#entryclienttsx
 */

import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { startTransition, StrictMode, useCallback, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import { createEmotionCache, theme } from "~/theme";
import ClientStyleContext from "~/theme/client.context";

function ClientCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState(createEmotionCache());

  const reset = useCallback(() => {
    setCache(createEmotionCache());
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <HydratedRouter />
        </ThemeProvider>
      </ClientCacheProvider>
    </StrictMode>,
  );
});