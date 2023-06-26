import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Group, Avatar, Text, Badge } from "@mantine/core";
import { List, EditButton, DeleteButton } from "@refinedev/mantine";

import { authProvider } from "@lib/authProvider";
import { Product, Price } from "@lib/types";
import { Table, Loading, Error, Empty } from "@components";

const ListProducts = () => {
  const columns = useMemo<ColumnDef<Product>[]>(() => {
    return [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue, table }) => {
          const value = getValue() as string;
          const data = table.options.data;

          const product = data.find((item) => item.name === value);

          return (
            <Group>
              <Avatar size="lg" src={product?.photo} />
              <Text fw={500}>{product?.name}</Text>
            </Group>
          );
        },
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        cell: ({ getValue }) => {
          return (
            <Badge tt="capitalize" color="yellow" size="md">
              {getValue() as string}
            </Badge>
          );
        },
      },
      {
        id: "prices",
        header: "Price",
        accessorKey: "prices",
        cell: ({ getValue }) => {
          const value = getValue() as Price[];

          return (
            <Text fz="sm" fw={700}>
              GH₵{value[0].amount.toFixed(2)}
            </Text>
          );
        },
      },
      {
        id: "inStock",
        header: "InStock",
        accessorKey: "inStock",
        cell: ({ getValue }) => {
          const value = getValue() as boolean;

          return value ? (
            <Badge color="green">
              <Text tt="lowercase">True</Text>
            </Badge>
          ) : (
            <Badge color="red">
              <Text tt="lowercase">False</Text>
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => {
          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={getValue() as string} />
              <DeleteButton hideText recordItemId={getValue() as string} />
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

  const products = data?.data ?? [];
  // const total = data?.total ?? 0

  isLoading && <Loading />;
  isError && <Error />;

  return (
    <List>
      {!products.length ? (
        <Empty text="no products available" />
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

export default ListProducts;
