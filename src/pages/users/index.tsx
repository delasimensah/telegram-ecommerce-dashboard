import { useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import millify from "millify";
import axios from "axios";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useModal } from "@refinedev/core";
import { List, useForm } from "@refinedev/mantine";
import {
  Group,
  Avatar,
  Text,
  Button,
  Badge,
  Modal,
  Textarea,
  Stack,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty, BlockButton } from "@components";
import { User } from "@lib/types";

const ListUsers = () => {
  const [id, setId] = useState("");
  const [sending, setSending] = useState(false);

  const { visible, show, close } = useModal();

  const { getInputProps, validate, setFieldValue, values } = useForm({
    initialValues: {
      message: "",
    },
    validate: {
      message: (value) => (value.length < 2 ? "Message is too short" : null),
    },
  });

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "id",
        cell: ({ getValue, table }) => {
          const value = getValue() as string;
          const data = table.options.data;

          const user = data.find((item) => item.id === value);

          return (
            <Group>
              <Avatar color="primary" size="md" radius="xl">
                {user?.firstName?.charAt(0)}
              </Avatar>
              <Text fw={500}>{user?.firstName}</Text>
            </Group>
          );
        },
      },
      {
        id: "blocked",
        header: "Status",
        accessorKey: "blocked",
        cell: ({ getValue }) => {
          const value = getValue() as boolean;

          return value ? (
            <Badge color="red">
              <Text tt="capitalize">Blocked</Text>
            </Badge>
          ) : (
            <Badge color="green">
              <Text tt="capitalize">Active</Text>
            </Badge>
          );
        },
      },
      {
        id: "totalOrders",
        header: "Total Confirmed Orders",
        accessorKey: "totalOrders",
      },
      {
        id: "amountSpent",
        header: "Total Amount Spent",
        accessorKey: "amountSpent",
        cell: ({ getValue }) => {
          const value = getValue() as number;

          return (
            <Text fz="sm" fw={700}>
              GH₵{" "}
              {millify(value, {
                precision: 3,
              })}
            </Text>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue, table }) => {
          const value = getValue() as string;
          const data = table.options.data;

          const user = data.find((item) => item.id === value);
          const isBlocked = user?.blocked as boolean;

          return (
            <Group spacing="xs" noWrap>
              <BlockButton blocked={isBlocked} id={value} />

              <Button size="xs" onClick={() => openMessageModal(value)}>
                Send Message
              </Button>
            </Group>
          );
        },
      },
    ];
  }, []);

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      pageCount,
      current,
      setCurrent,
      tableQueryResult: { data, isLoading, isError },
    },
  } = useTable({ columns });

  const users = data?.data ?? [];
  const total = data?.total ?? 0;

  async function openMessageModal(id: string) {
    show();
    setId(id);
  }

  async function closeMessageModal() {
    close(), setFieldValue("message", "");
  }

  async function sendMessage() {
    const { hasErrors } = validate();

    if (hasErrors) return;

    setSending(true);

    try {
      if (id) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/sendMessage`,
          {
            chat_id: id,
            text: values.message,
          }
        );

        setSending(false);

        showNotification({
          message: `Message to ${id} sent`,
          color: "green",
        });
      } else {
        await Promise.all(
          users.map((user) => {
            axios.post(
              `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/sendMessage`,
              {
                chat_id: user.id,
                text: values.message,
              }
            );
          })
        );

        setSending(false);

        showNotification({
          message: `Broadcast message sent`,
          color: "green",
        });
      }
      closeMessageModal();
    } catch (error) {
      console.log(error);
      setSending(false);
      showNotification({
        message: "An error occurred sending the message. Try again",
      });
    }
  }

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <List
      title={
        <Title order={3}>
          {" "}
          {total} User{total > 2 ? "s" : ""}
        </Title>
      }
      canCreate={false}
      headerButtons={
        <Button onClick={() => openMessageModal("")}>Send Broadcast</Button>
      }
    >
      {!users.length ? (
        <Empty text="no users available" />
      ) : (
        <Table
          getHeaderGroups={getHeaderGroups}
          getRowModel={getRowModel}
          pageCount={pageCount}
          current={current}
          setCurrent={setCurrent}
        />
      )}

      <Modal
        opened={visible}
        onClose={closeMessageModal}
        title={id ? "Send User Message" : "Send Broadcast Message"}
      >
        <Stack>
          <Textarea {...getInputProps("message")} />
          <Button loading={sending} onClick={sendMessage}>
            Send Message
          </Button>
        </Stack>
      </Modal>
    </List>
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

export default ListUsers;
