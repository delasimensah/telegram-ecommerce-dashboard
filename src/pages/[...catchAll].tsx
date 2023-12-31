import { ErrorComponent } from "@refinedev/mantine";
import { GetServerSideProps } from "next";
import { authProvider } from "src/lib/authProvider";

export default function CatchAll() {
  return <ErrorComponent />;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  if (!authenticated) {
    return {
      props: {},
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent(
          context.req.url || "/"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
