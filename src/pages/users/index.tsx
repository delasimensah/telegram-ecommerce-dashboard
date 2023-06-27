import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Group, Avatar, Text, Button, Badge } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty } from "@components";
import { User } from "@lib/types";
import millify from "millify";

const ListUsers = () => {
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
              <Avatar color="green.6" size="md" radius="lg">
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
        cell: ({ getValue }) => {
          const value = getValue() as string;

          return (
            <Group spacing="xs" noWrap>
              <Button size="xs" color="red" onClick={() => updateUser(value)}>
                Block User
              </Button>
              <Button size="xs" onClick={() => sendMessage(value)}>
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

  async function updateUser(id: string) {
    console.log("block user: ", id);
  }

  async function sendMessage(id: string) {
    console.log("send message to: ", id);
  }

  const users = data?.data ?? [];
  // const total = data?.total ?? 0;

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

  return (
    <List canCreate={false}>
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
