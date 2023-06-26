import { useState } from "react";
import { GetServerSideProps } from "next";
import { Create, useForm, useSelect } from "@refinedev/mantine";
import {
  TextInput,
  Textarea,
  FileButton,
  Button,
  Select,
  Group,
  Stack,
  ActionIcon,
  Text,
  NumberInput,
  Progress,
  Tooltip,
} from "@mantine/core";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { authProvider } from "@lib/authProvider";
import { storage } from "@lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Category } from "@lib/types";

const CreateProduct = () => {
  const [progress, setProgress] = useState(0);

  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading },
    insertListItem,
    removeListItem,
    values,
    setFieldValue,
  } = useForm({
    initialValues: {
      photo: "",
      name: "",
      description: "",
      category: "",
      prices: [{ quantity: 0, amount: 0 }],
    },
    validate: {
      photo: (value) => (value.length < 1 ? "Please upload an image" : null),
      name: (value) => (value.length < 1 ? "Product name is required" : null),
      description: (value) =>
        value.length < 1 ? "Product description is required" : null,
      category: (value) =>
        value.length < 1 ? "Please choose a category" : null,
      prices: {
        quantity: (value) => (value < 1 ? "Ouantity is required" : null),
        amount: (value) => (value < 1 ? "Amount is required" : null),
      },
    },
  });

  const { selectProps } = useSelect<Category>({
    resource: "categories",
    optionLabel: "name",
    optionValue: "name",
  });

  const handleOnChange = async (payload: File | null) => {
    const storageRef = ref(storage, payload?.name);

    const uploadTask = uploadBytesResumable(storageRef, payload as File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case "running":
            console.log(progress);
            setProgress(progress);
            break;
        }
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFieldValue("photo", downloadURL);
        });
      }
    );
  };

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Stack spacing="lg">
        <Group>
          <FileButton
            {...getInputProps("photo")}
            onChange={handleOnChange}
            accept="image/png,image/jpeg"
          >
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>

          {values.photo && <Text size="xs">Image uploaded</Text>}

          {getInputProps("photo").error && (
            <Text size="xs" color="red">
              {getInputProps("photo").error}
            </Text>
          )}

          {values.photo && (
            <Tooltip
              sx={{ fontSize: "12px" }}
              label="Clear image"
              withArrow
              position="right"
            >
              <ActionIcon
                color="red"
                onClick={() => {
                  setFieldValue("photo", "");
                  setProgress(0);
                }}
              >
                <AiOutlineCloseCircle />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        {progress > 0 && <Progress size="xs" value={progress} />}

        <TextInput label="Product Name" {...getInputProps("name")} />

        <Textarea
          label="Product Description"
          minRows={6}
          {...getInputProps("description")}
        />

        <Select
          label="Choose Category"
          {...getInputProps("category")}
          {...selectProps}
        />

        <>
          {values.prices.map((_, index) => (
            <Group align="center" key={index}>
              <NumberInput
                hideControls
                label="Quantity"
                {...getInputProps(`prices.${index}.quantity`)}
              />
              <NumberInput
                defaultValue={0}
                label="Amount"
                hideControls
                {...getInputProps(`prices.${index}.amount`)}
              />
              <ActionIcon
                color="red"
                onClick={() => {
                  removeListItem("prices", index);
                }}
              >
                <AiOutlineCloseCircle />
              </ActionIcon>
            </Group>
          ))}
        </>

        <Group mt="lg">
          <Button
            onClick={() => insertListItem("prices", { name: "", price: 0 })}
          >
            Add More Prices
          </Button>
        </Group>
      </Stack>
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

export default CreateProduct;
