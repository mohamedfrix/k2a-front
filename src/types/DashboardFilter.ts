import { Table } from "@tanstack/react-table";

export type DashboardSearchFilterProps<TData> = {
  table: Table<TData>;
  placeholder: string;
  columnKey: string;
};

export type DashboarDropDownFilterProps<TData> = {
  table: Table<TData>;
  columnKey: string;

  triggerText: string;
  items: { label: string }[];
};
