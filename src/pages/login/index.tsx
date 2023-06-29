import { AuthPage } from "@refinedev/mantine";

import { GetServerSideProps } from "next";
import { authProvider } from "@lib/authProvider";

export default function Login() {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: { email: "bot@admin.com", password: "BotAdmin!!" },
      }}
      title={<></>}
      registerLink={<></>}
      rememberMe={<></>}
      forgotPasswordLink={<></>}
    />
  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
