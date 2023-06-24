import React from "react";
import { GetServerSideProps } from "next";
import { Edit, useForm } from "@refinedev/mantine";
import { TextInput, Select, Stack } from "@mantine/core";
import { authProvider } from "@lib/authProvider";

const EditCategory = () => {
  const { getInputProps, saveButtonProps } = useForm({
    initialValues: { name: "", active: "" },
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Stack>
        <TextInput mt="sm" label="Name" {...getInputProps("name")} />

        <Select
          label="Active"
          data={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          {...getInputProps("active")}
          value={String(getInputProps("active").value)}
        />
      </Stack>
    </Edit>
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

export default EditCategory;
