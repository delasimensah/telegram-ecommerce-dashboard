import { FC, useState, useEffect } from "react";
import { Refine } from "@refinedev/core";
import {
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
  notificationProvider,
} from "@refinedev/mantine";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";

import { Header } from "@components";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import dataProvider from "@refinedev/simple-rest";
import { authProvider } from "@lib/authProvider";

import { FaUsers, FaTags, FaInbox, FaStore } from "react-icons/fa";

import theme from "@lib/mantineTheme";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
          <ThemedTitleV2 collapsed={collapsed} text="Bot Dashboard" />
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
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          ...RefineThemes.Purple,
          ...theme,
          colorScheme: colorScheme,
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <NotificationsProvider position="top-right">
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL as string)}
            notificationProvider={notificationProvider}
            authProvider={authProvider}
            resources={[
              {
                name: "categories",
                list: "/categories",
                create: "/categories/create",
                edit: "/categories/edit/:id",
                meta: {
                  canDelete: true,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/create",
                edit: "/products/edit/:id",
                meta: {
                  icon: <FaTags />,
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
                show: "/orders/show/:id",
                meta: {
                  icon: <FaInbox />,
                },
              },
              {
                name: "vendors",
                list: "/vendors",
                create: "/vendors/create",
                edit: "/vendors/edit/:id",
                meta: {
                  icon: <FaStore />,
                  label: "Store",
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
            <DefaultSeo
              title="Bot Dashboard"
              description="A web application to manage products sold via a telegram bot"
            />

            <UnsavedChangesNotifier />

            {renderComponent()}
          </Refine>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default MyApp;
