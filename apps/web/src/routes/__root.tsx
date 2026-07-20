import { Toaster } from "@chronicles-of-all-creation/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/theme-provider";
import type { trpc } from "@/utils/trpc";

import "../index.css";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Chronicles of All Creation",
      },
      {
        name: "description",
        content:
          "Chronicles of All Creation: a Create-driven Minecraft modpack where machinery carries you from your first cogwheel to colonies among the stars. Join at minecraft.citadel-codex.com",
      },
      {
        property: "og:title",
        content: "Chronicles of All Creation",
      },
      {
        property: "og:description",
        content: "From the first cogwheel to the last unmapped star.",
      },
      {
        property: "og:image",
        content: "/hero.png",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/logo.png",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <Outlet />
        <Toaster richColors />
      </ThemeProvider>
      {import.meta.env.DEV ? (
        <>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        </>
      ) : null}
    </>
  );
}
