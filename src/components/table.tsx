import { FC } from "react";
import { HeaderGroup, RowModel, flexRender } from "@tanstack/react-table";
import { ScrollArea, Table as MantineTable, Pagination } from "@mantine/core";

type TableProps = {
  getHeaderGroups: () => HeaderGroup<any>[];
  getRowModel: () => RowModel<any>;
  pageCount: number;
  current: number;
  setCurrent: ((page: number) => void) | undefined;
};

const Table: FC<TableProps> = ({
  getHeaderGroups,
  getRowModel,
  pageCount,
  current,
  setCurrent,
}) => {
  return (
    <>
      <ScrollArea>
        <MantineTable highlightOnHover striped verticalSpacing="md">
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
        </MantineTable>
      </ScrollArea>

      <br />

      <Pagination
        position="right"
        total={pageCount}
        page={current}
        onChange={setCurrent}
      />
    </>
  );
};

export default Table;
