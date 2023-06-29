import { useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import millify from "millify";
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
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty, BlockButton } from "@components";
import { User } from "@lib/types";
import { sendBotMessage } from "@lib/bot-requests";

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
                {user?.username?.charAt(0)}
              </Avatar>
              <Text fw={500}>{user?.username}</Text>
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
  } = useTable({ columns, refineCoreProps: { pagination: { mode: "off" } } });

  const users = data?.data ?? [];
  // const testUsers = ["1095070582", "921745333", "6075714878"];
  // const total = data?.total ?? 0;

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
        await sendBotMessage(id, values.message);

        setSending(false);

        showNotification({
          message: `Message to ${id} sent`,
          color: "green",
        });
      } else {
        await Promise.all(
          users.map((user) => {
            sendBotMessage(user?.id as string, values.message);
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

  // async function sendInviteBC() {
  //   setSending(true);

  //   try {
  //     await Promise.all(
  //       testUsers.map((id) => {
  //         sendBotMessage(id, "/start");
  //       })
  //     );

  //     setSending(false);

  //     showNotification({
  //       message: `Invite broadcast message sent`,
  //       color: "green",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <List
      canCreate={false}
      headerButtons={
        <>
          {users.length ? (
            <Button onClick={() => openMessageModal("")}>Send Broadcast</Button>
          ) : null}
          {/* <Button onClick={sendInviteBC} loading={sending}>
            Send Invite Broadcast
          </Button> */}
        </>
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
