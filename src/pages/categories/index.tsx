import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Group, Switch } from "@mantine/core";
import { List, EditButton, DeleteButton } from "@refinedev/mantine";

import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty } from "@components";

const ListCategories = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
      },
      {
        id: "active",
        header: "Active",
        accessorKey: "active",
        cell: ({ getValue }) => {
          return <Switch checked={getValue() as boolean} size="md" />;
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
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

  const categories = data?.data ?? [];
  // const total = data?.total ?? 0;

  let content = null;

  if (isLoading) {
    content = <Loading />;
  }

  if (isError) {
    content = <Error />;
  }

  if (!categories.length) {
    content = <Empty text="no categories available" />;
  } else {
    content = (
      <Table
        getHeaderGroups={getHeaderGroups}
        getRowModel={getRowModel}
        pageCount={pageCount}
        current={current}
        setCurrent={setCurrent}
      />
    );
  }

  return <List>{content}</List>;
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

export default ListCategories;
