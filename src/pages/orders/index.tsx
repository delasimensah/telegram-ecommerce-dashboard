import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { List } from "@refinedev/mantine";
import { authProvider } from "@lib/authProvider";
import { Table, Loading, Error, Empty } from "@components";

const ListOrders = () => {
  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
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
