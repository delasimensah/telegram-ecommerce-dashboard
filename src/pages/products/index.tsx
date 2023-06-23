import React from "react";
import { GetServerSideProps } from "next";

import { authProvider } from "@lib/authProvider";

const ListProducts = () => {
  return <div>Product List</div>;
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  if (!authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default ListProducts;
