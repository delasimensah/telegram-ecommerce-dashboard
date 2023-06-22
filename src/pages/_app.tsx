import { FC, useState, useEffect } from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
  notificationProvider,
} from "@refinedev/mantine";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { Header } from "@components/header";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import dataProvider from "@refinedev/simple-rest";
import { authProvider } from "@lib/authProvider";

import { FaUsers, FaTags, FaInbox } from "react-icons/fa";

import theme from "@lib/mantineTheme";

const API_URL = "https://api.fake-rest.refine.dev";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Title={({ collapsed }) => (
          <ThemedTitleV2 collapsed={collapsed} text="Bot Frontend" />
        )}
        Header={() => <Header sticky />}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  if (isSSR) return null;

  return (
    <RefineKbarProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            ...theme,
            ...RefineThemes.Magenta,
            colorScheme: colorScheme,
          }}
          withNormalizeCSS
          withGlobalStyles
        >
          <NotificationsProvider position="top-right">
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(API_URL)}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              resources={[
                // {
                //   name: "blog_posts",
                //   list: "/blog-posts",
                //   create: "/blog-posts/create",
                //   edit: "/blog-posts/edit/:id",
                //   show: "/blog-posts/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                // {
                //   name: "categories",
                //   list: "/old-categories",
                //   create: "/old-categories/create",
                //   edit: "/old-categories/edit/:id",
                //   show: "/old-categories/show/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
                {
                  name: "products",
                  list: "/products",
                  create: "/products/create",
                  edit: "/products/edit/:id",
                  show: "/products/show/:id",
                  meta: {
                    icon: <FaTags />,
                  },
                },
                {
                  name: "categories",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  meta: {
                    icon: <FaUsers />,
                  },
                },
                {
                  name: "orders",
                  list: "/orders",
                  meta: {
                    icon: <FaInbox />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                reactQuery: {
                  devtoolConfig: false,
                },
              }}
            >
              {renderComponent()}

              <RefineKbar />

              <UnsavedChangesNotifier />

              <DocumentTitleHandler
                handler={({ pathname, resource }) => {
                  let title = "Bot Frontend";

                  if (pathname !== "/login") {
                    title = `${resource?.name
                      .charAt(0)
                      .toUpperCase()}${resource?.name.substring(
                      1
                    )} | Bot Frontend`;
                  }

                  return title;
                }}
              />
            </Refine>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </RefineKbarProvider>
  );
};

export default MyApp;
