import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { ScrollArea, Table, Pagination, Group, Switch } from "@mantine/core";
import { List, EditButton, ShowButton, DeleteButton } from "@refinedev/mantine";

import { authProvider } from "@lib/authProvider";

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
        accessorKey: "name",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <ShowButton hideText recordItemId={getValue() as string} />
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
    setOptions,
    refineCore: { pageCount, current, setCurrent },
  } = useTable({ columns });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.data,
    },
  }));

  return (
    <List
      createButtonProps={{
        variant: "subtle",
      }}
    >
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

export default ListCategories;

{
  /* <div>
      {categories?.map((category) => {
        return <p key={category.name}>{category.name}</p>;
      })}
    </div> */
}
