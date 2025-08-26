# DataTable Implementation Guide

## 📚 **Table of Contents**

1. [Architecture Overview](#architecture-overview)
2. [Component Breakdown](#component-breakdown)
3. [How to Reuse for Different Tables](#how-to-reuse)
4. [Action Handlers Configuration](#action-handlers)
5. [Filtering and Searching](#filtering)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## 🏗️ **Architecture Overview**

The DataTable implementation uses **TanStack Table (React Table v8)** and follows a modular, reusable architecture:

```
📁 admin/[table-name]/
├── 📄 page.tsx           # Main page component
├── 📄 data-table.tsx     # Generic table component
├── 📄 columns.tsx        # Column definitions & actions
└── 📄 data-table-column-header.tsx  # Sortable headers
```

### **Key Dependencies:**
- `@tanstack/react-table` - Table functionality
- `@radix-ui/react-dropdown-menu` - Action menus
- `lucide-react` - Icons
- Custom UI components (Button, Table, Input)

---

## 🧩 **Component Breakdown**

### 1. **Main Page Component (`page.tsx`)**

**Purpose**: Orchestrates the entire table page

```tsx
"use client";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const data = [ /* your data array */ ];

export default function TablePage() {
  return (
    <div className="w-full min-h-full">
      <DashboardNavBar />
      <div className="m-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
```

**Key Responsibilities:**
- Data fetching (API calls)
- State management 
- Layout structure
- Passing data to DataTable

### 2. **Generic DataTable Component (`data-table.tsx`)**

**Purpose**: Reusable table wrapper with filtering and display logic

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters },
  });

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Filters */}
      <div className="flex justify-start gap-4 m-4">
        <TableSearchFilter />
        <TableDropDownFilter />
      </div>
      
      {/* Table */}
      <Table>
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
}
```

**Features:**
- **Generic**: Works with any data type
- **Filtering**: Column-based filtering
- **Sorting**: Built-in sorting capabilities
- **Responsive**: Mobile-friendly overflow handling

### 3. **Column Definitions (`columns.tsx`)**

**Purpose**: Defines table structure, cell rendering, and actions

```tsx
export type YourDataType = {
  id: string;
  field1: string;
  field2: number;
  // ... other fields
};

export const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: "field1",           // Data field to access
    header: ({ column }) => (        // Header with sorting
      <DataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => (             // Cell renderer
      <div className="font-medium">
        {row.getValue("field1")}
      </div>
    ),
  },
  // ... more columns
  {
    id: "actions",                   // Special actions column
    enableHiding: false,
    cell: ({ row }) => (
      <ActionsDropdown row={row.original} />
    ),
  },
];
```

### 4. **Column Header (`data-table-column-header.tsx`)**

**Purpose**: Sortable column headers with visibility controls

```tsx
export function DataTableColumnHeader({ column, title }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {title}
          {/* Sort indicator icons */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          Desc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🔄 **How to Reuse for Different Tables**

### **Step 1: Create Directory Structure**

```bash
src/app/admin/[your-table]/
├── page.tsx
├── data-table.tsx      # Copy from existing or create shared
├── columns.tsx         # Table-specific
└── types.ts           # Optional: separate types
```

### **Step 2: Define Your Data Type**

```tsx
// types.ts or in columns.tsx
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Suspended";
  // ... other fields
};
```

### **Step 3: Create Column Definitions**

```tsx
// columns.tsx
export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("firstName")}
      </div>
    ),
  },
  // ... other columns
  {
    id: "actions",
    cell: ({ row }) => <ClientActions client={row.original} />,
  },
];
```

### **Step 4: Customize DataTable Filters**

```tsx
// In data-table.tsx, customize the filters section:
<div className="flex justify-start gap-4 m-4">
  <TableSearchFilter
    table={table}
    placeholder="Search by name"      // Customize placeholder
    columnKey="firstName"             // Change search column
  />
  <TableDropDownFilter
    table={table}
    columnKey="status"               // Change filter column
    triggerText="Filter by Status"   // Customize trigger text
    items={[                         // Customize filter options
      { label: "Active" },
      { label: "Inactive" },
      { label: "Suspended" },
    ]}
  />
</div>
```

---

## ⚡ **Action Handlers Configuration**

### **Action Component Structure**

```tsx
interface ActionsProps {
  data: YourDataType;
}

function TableActions({ data }: ActionsProps) {
  // Action handlers
  const handleView = () => {
    console.log("Viewing:", data.id);
    // router.push(`/admin/your-table/${data.id}`);
  };

  const handleEdit = () => {
    console.log("Editing:", data.id);
    // Open modal, navigate to edit page, etc.
  };

  const handleDelete = async () => {
    if (confirm("Are you sure?")) {
      try {
        // await deleteApi(data.id);
        // refresh data or update state
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### **Common Action Patterns**

1. **Navigation Actions**
```tsx
const handleView = () => {
  router.push(`/admin/clients/${client.id}`);
};
```

2. **Modal Actions**
```tsx
const handleEdit = () => {
  setSelectedItem(client);
  setEditModalOpen(true);
};
```

3. **API Actions**
```tsx
const handleDelete = async () => {
  try {
    await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
    // Refresh data
    mutate(); // if using SWR
  } catch (error) {
    toast.error("Failed to delete client");
  }
};
```

4. **Status Toggle Actions**
```tsx
const handleToggleStatus = async () => {
  const newStatus = client.status === "Active" ? "Inactive" : "Active";
  await updateClientStatus(client.id, newStatus);
};
```

---

## 🔍 **Filtering and Searching**

### **Available Filter Components**

1. **Text Search Filter**
```tsx
<TableSearchFilter
  table={table}
  placeholder="Search by client name"
  columnKey="firstName"  // Column to search in
/>
```

2. **Dropdown Filter**
```tsx
<TableDropDownFilter
  table={table}
  columnKey="status"
  triggerText="Filter by Status"
  items={[
    { label: "Active" },
    { label: "Inactive" },
    { label: "Suspended" },
  ]}
/>
```

### **Custom Filter Implementation**

```tsx
// Custom date range filter
function DateRangeFilter({ table }: { table: any }) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        onChange={(e) => {
          // Custom filtering logic
          table.getColumn("dateJoined")?.setFilterValue({
            start: e.target.value,
            end: endDate
          });
        }}
      />
    </div>
  );
}
```

### **Global Search Implementation**

```tsx
// In data-table.tsx
const [globalFilter, setGlobalFilter] = useState("");

const table = useReactTable({
  data,
  columns,
  state: {
    columnFilters,
    globalFilter,  // Add global filter
  },
  onGlobalFilterChange: setGlobalFilter,
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: fuzzyFilter, // Custom filter function
});
```

---

## ✅ **Best Practices**

### **1. Data Management**
```tsx
// Use proper state management
const [data, setData] = useState<Client[]>([]);
const [loading, setLoading] = useState(true);

// Fetch data on mount
useEffect(() => {
  fetchClients().then(setData).finally(() => setLoading(false));
}, []);

// Use SWR or React Query for better data management
import useSWR from 'swr';
const { data, error, mutate } = useSWR('/api/clients', fetchClients);
```

### **2. Type Safety**
```tsx
// Define proper TypeScript interfaces
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: ClientStatus; // Use enums for status
}

type ClientStatus = "Active" | "Inactive" | "Suspended";
```

### **3. Error Handling**
```tsx
const handleAction = async () => {
  try {
    setLoading(true);
    await performAction();
    toast.success("Action completed successfully");
    mutate(); // Refresh data
  } catch (error) {
    toast.error("Action failed: " + error.message);
  } finally {
    setLoading(false);
  }
};
```

### **4. Accessibility**
```tsx
// Add proper ARIA labels
<Button 
  variant="ghost" 
  className="h-8 w-8 p-0"
  aria-label={`Actions for ${client.firstName} ${client.lastName}`}
>
  <MoreHorizontal className="h-4 w-4" />
</Button>
```

### **5. Performance Optimization**
```tsx
// Memoize column definitions
const columns = useMemo(() => [
  // column definitions
], []);

// Virtualization for large datasets
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## 📝 **Examples**

### **Example 1: Simple Vehicles Table**
```tsx
// vehicles/columns.tsx
export const vehicleColumns = [
  {
    accessorKey: "name",
    header: "Vehicle Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <VehicleActions vehicle={row.original} />,
  },
];
```

### **Example 2: Complex Bookings Table**
```tsx
// bookings/columns.tsx
export const bookingColumns = [
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.client.firstName}</div>
        <div className="text-sm text-muted-foreground">{row.original.client.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "dateRange",
    header: "Rental Period",
    cell: ({ row }) => (
      <div>
        <div>{format(row.original.startDate, 'PP')}</div>
        <div className="text-sm text-muted-foreground">
          to {format(row.original.endDate, 'PP')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-mono font-medium">
        €{row.getValue("totalAmount")}
      </div>
    ),
  },
];
```

### **Example 3: Custom Action Handlers**
```tsx
function BookingActions({ booking }: { booking: Booking }) {
  const router = useRouter();
  
  const handleConfirm = async () => {
    await updateBookingStatus(booking.id, "Confirmed");
    toast.success("Booking confirmed");
  };
  
  const handleCancel = async () => {
    if (confirm("Cancel this booking?")) {
      await updateBookingStatus(booking.id, "Cancelled");
      toast.success("Booking cancelled");
    }
  };
  
  const handleViewContract = () => {
    window.open(`/contracts/${booking.contractId}`, '_blank');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
        
        {booking.status === "Pending" && (
          <DropdownMenuItem onClick={handleConfirm} className="text-green-600">
            <Check className="mr-2 h-4 w-4" />
            Confirm Booking
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleViewContract}>
          <FileText className="mr-2 h-4 w-4" />
          View Contract
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleCancel} className="text-red-600">
          <X className="mr-2 h-4 w-4" />
          Cancel Booking
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## 🎯 **Summary**

The DataTable implementation provides:

1. **Reusability**: One table component for all admin tables
2. **Flexibility**: Easy customization of columns, filters, and actions
3. **Type Safety**: Full TypeScript support
4. **Performance**: Efficient rendering and filtering
5. **User Experience**: Sorting, filtering, and intuitive actions

**To create a new table:**
1. Copy the data-table.tsx (or create shared)
2. Define your data type
3. Create column definitions with actions
4. Customize filters for your data
5. Implement action handlers for your business logic

This modular approach ensures consistent UX across all admin tables while allowing for table-specific customizations.