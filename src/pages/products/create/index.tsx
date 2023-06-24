import { useState } from "react";
import { GetServerSideProps } from "next";
import { useList } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
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

const CreateProduct = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const {
    getInputProps,
    saveButtonProps,
    refineCore: { formLoading, onFinish, redirect },
    insertListItem,
    removeListItem,
    values,
    setFieldValue,
    validate,
  } = useForm({
    initialValues: {
      photo: "",
      name: "",
      description: "",
      category: "",
      prices: [{ name: "", price: 0 }],
    },
    validate: {
      photo: (value) => (value.length < 1 ? "Please upload an image" : null),
      name: (value) => (value.length < 1 ? "Product name is required" : null),
      description: (value) =>
        value.length < 1 ? "Product description is required" : null,
      category: (value) =>
        value.length < 1 ? "Please choose a category" : null,
      prices: {
        name: (value) => (value.length < 2 ? "Price name is required" : null),
        price: (value) => (value < 1 ? "Price amount is required" : null),
      },
    },
  });

  const { data } = useList({
    resource: "categories",
  });

  const categories = data?.data ?? [];

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

        <TextInput placeholder="Product Name" {...getInputProps("name")} />

        <Textarea
          placeholder="Product Description"
          minRows={6}
          {...getInputProps("description")}
        />

        <Select
          placeholder="Choose Category"
          data={categories
            .filter((c) => c.active === true)
            .map((cat) => {
              return { value: cat.name, label: cat.name };
            })}
          {...getInputProps("category")}
        />

        <>
          {values.prices.map((_, index) => (
            <Group key={index}>
              <TextInput
                placeholder="Price Name"
                {...getInputProps(`prices.${index}.name`)}
              />
              <NumberInput
                defaultValue={0}
                placeholder="Price Amount"
                hideControls
                {...getInputProps(`prices.${index}.price`)}
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
