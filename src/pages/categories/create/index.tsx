import React from "react";
import { GetServerSideProps } from "next";
import { Create, useForm } from "@refinedev/mantine";
import { TextInput } from "@mantine/core";

import { authProvider } from "@lib/authProvider";

const CreateCategory = () => {
  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading },
  } = useForm({
    initialValues: { name: "" },
    validate: {
      name: (value) => (value.length < 1 ? "Category name required" : null),
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <TextInput
        placeholder="Category Name"
        mt="sm"
        {...getInputProps("name")}
      />
    </Create>
  );
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

export default CreateCategory;
