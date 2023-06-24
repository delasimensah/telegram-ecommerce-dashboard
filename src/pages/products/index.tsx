import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  ScrollArea,
  Table,
  Pagination,
  Group,
  Avatar,
  Text,
  Badge,
  Center,
  Title,
} from "@mantine/core";
import { List, EditButton, DeleteButton } from "@refinedev/mantine";

import { authProvider } from "@lib/authProvider";

type Price = {
  name: string;
  price: number;
};

type Name = {
  name: string;
  photo: string;
};

type Product = {
  name: Name;
  category: string;
  description: string;
  prices: Price[];
};

const ListProducts = () => {
  const columns = useMemo<ColumnDef<Product>[]>(() => {
    return [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => {
          const value = getValue() as Name;

          return (
            <Group>
              <Avatar size="lg" src={value.photo} />
              <Text fw={500}>{value.name}</Text>
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
            <Badge color="yellow" size="md">
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
              GH₵{value[0].price.toFixed(2)}
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
              <Text tt="capitalize">True</Text>
            </Badge>
          ) : (
            <Badge color="red">
              <Text tt="capitalize">False</Text>
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
      tableQueryResult: { data },
    },
  } = useTable({ columns });

  const products = data?.data ?? [];
  // const total = data?.total ?? 0

  return (
    <List>
      {products.length ? (
        <>
          <ScrollArea>
            <Table highlightOnHover striped verticalSpacing="md">
              <thead>
                {getHeaderGroups().map((headerGroup) => {
                  return (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th key={header.id}>
                            {!header.isPlaceholder &&
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>

              <tbody>
                {getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>

          <br />

          <Pagination
            position="right"
            total={pageCount}
            page={current}
            onChange={setCurrent}
          />
        </>
      ) : (
        <Center mih="150px">
          <Title order={4} fw={700}>
            No Products Available
          </Title>
        </Center>
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
