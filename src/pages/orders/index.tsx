import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { List, ShowButton, DeleteButton } from "@refinedev/mantine";
import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty } from "@components";
import { Group, Text } from "@mantine/core";
import { CartProduct, Order } from "@lib/types";
import millify from "millify";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

const ListOrders = () => {
  const columns = useMemo<ColumnDef<Order>[]>(() => {
    return [
      {
        id: "id",
        header: "Order ID",
        accessorKey: "id",
      },
      {
        id: "contactNumber",
        header: "Contact Number",
        accessorKey: "contactNumber",
      },
      {
        id: "products",
        header: "No Of Products",
        accessorKey: "products",
        cell: ({ getValue }) => {
          const value = getValue() as CartProduct[];
          return <Text>{value.length}</Text>;
        },
      },
      {
        id: "total",
        header: "Total",
        accessorKey: "total",
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
        id: "createdAt",
        header: "Placed On",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const value = getValue() as string;

          return <Text>{dayjs(value).format("MMM D, YYYY h:mm A")}</Text>;
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
              <ShowButton variant="subtle" hideText recordItemId={value} />
              <DeleteButton variant="subtle" hideText recordItemId={value} />
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

  const orders = data?.data ?? [];
  // const total = data?.total ?? 0;

  isLoading && <Loading />;
  isError && <Error />;

  return (
    <List canCreate={false}>
      {!orders.length ? (
        <Empty text="no orders available" />
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

export default ListOrders;
