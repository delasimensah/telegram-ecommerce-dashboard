import { GetServerSideProps } from "next";
import { Edit, useForm } from "@refinedev/mantine";
import { TextInput, Select, Stack, Title } from "@mantine/core";
import { authProvider } from "@lib/authProvider";

const VendorList = () => {
  const { getInputProps, saveButtonProps } = useForm({
    initialValues: {
      storeName: "",
      mobileMoneyName: "",
      mobileMoneyNumber: "",
      active: "",
    },
    refineCoreProps: {
      action: "edit",
      resource: "vendors",
      id: process.env.NEXT_PUBLIC_SHOP_ID,
    },
  });

  return (
    <Edit
      title={<Title order={3}>Edit Store Details</Title>}
      headerButtons={<></>}
      saveButtonProps={saveButtonProps}
    >
      <Stack>
        <TextInput mt="sm" label="Store Name" {...getInputProps("storeName")} />

        <TextInput
          mt="sm"
          label="Mobile Money Name"
          {...getInputProps("mobileMoneyName")}
        />

        <TextInput
          mt="sm"
          label="Mobile Money Number"
          {...getInputProps("mobileMoneyNumber")}
        />

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

export default VendorList;
