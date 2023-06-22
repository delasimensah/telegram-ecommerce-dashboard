import { MantineCreateInferencer } from "@refinedev/inferencer/mantine";
import { GetServerSideProps } from "next";
import { authProvider } from "src/lib/authProvider";

export default function BlogPostCreate() {
  return <MantineCreateInferencer />;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  // const { authenticated, redirectTo } = await authProvider.check(context);

  // if (!authenticated) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: `${redirectTo}?to=${encodeURIComponent("/blog-posts")}`,
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {},
  };
};
