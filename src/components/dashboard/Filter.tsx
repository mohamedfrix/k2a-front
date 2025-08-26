import {
  DashboarDropDownFilterProps,
  DashboardSearchFilterProps,
} from "@/types/DashboardFilter";
import { Input } from "../ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui";

export function TableSearchFilter<TData>({
  table,
  placeholder,
  columnKey,
}: DashboardSearchFilterProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={placeholder}
        value={(table.getColumn(columnKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(columnKey)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
}

export function TableDropDownFilter<TData>({
  table,
  columnKey,
  triggerText,
  items,
}: DashboarDropDownFilterProps<TData>) {
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 bg-surface text-on-surface">
          {triggerText}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item) => {
            return (
              <DropdownMenuItem
                key={item.label}
                onClick={() => {
                  table.getColumn(columnKey)?.setFilterValue(item.label);
                }}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
