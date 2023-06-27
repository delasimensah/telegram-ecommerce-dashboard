import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { List, ShowButton } from "@refinedev/mantine";
import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty } from "@components";
import { Group, Text, Badge } from "@mantine/core";

import { CartProduct, Order } from "@lib/types";
import millify from "millify";
import dayjs from "dayjs";

const ListOrders = () => {
  const columns = useMemo<ColumnDef<Order>[]>(() => {
    return [
      {
        id: "orderNumber",
        header: "Order",
        accessorKey: "orderNumber",

        cell: ({ getValue }) => {
          const value = getValue() as number;
          return <Text>#{value}</Text>;
        },
      },
      {
        id: "createdAt",
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const value = getValue() as string;

          return <Text>{dayjs(value).format("MMM D, YYYY h:mm A")}</Text>;
        },
      },
      {
        id: "contactNumber",
        header: "Contact Number",
        accessorKey: "contactNumber",
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
        id: "paymentStatus",
        header: "Payment Status",
        accessorKey: "paymentStatus",
        cell: ({ getValue }) => {
          const value = getValue() as string;

          return value === "unpaid" ? (
            <Badge color="red">
              <Text tt="capitalize">Unpaid</Text>
            </Badge>
          ) : (
            <Badge color="green">
              <Text tt="capitalize">Paid</Text>
            </Badge>
          );
        },
      },
      {
        id: "orderStatus",
        header: "Order Status",
        accessorKey: "orderStatus",
        cell: ({ getValue }) => {
          const value = getValue() as string;

          if (value === "pending")
            return (
              <Badge color="yellow">
                <Text tt="capitalize">pending</Text>
              </Badge>
            );

          if (value === "confirmed")
            return (
              <Badge color="green">
                <Text tt="capitalize">confirmed</Text>
              </Badge>
            );

          if (value === "cancelled")
            return (
              <Badge color="red">
                <Text tt="capitalize">cancelled</Text>
              </Badge>
            );
        },
      },
      {
        id: "products",
        header: "Items",
        accessorKey: "products",
        cell: ({ getValue }) => {
          const value = getValue() as CartProduct[];
          return <Text>{value.length}</Text>;
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

  if (isError) return <Error />;
  if (isLoading) return <Loading />;

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
