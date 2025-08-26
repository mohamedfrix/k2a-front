"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../vehicles/data-table-column-header"; // Reuse existing header
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the shape of our client data
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateJoined: string;
  totalRentals: number;
  status: "Active" | "Inactive" | "Suspended";
  lastActivity: string;
};

// Client-specific action handlers
interface ClientActionsProps {
  client: Client;
}

function ClientActions({ client }: ClientActionsProps) {
  const handleView = () => {
    console.log("Viewing client:", client.id);
    // Navigate to client details page
    // router.push(`/admin/clients/${client.id}`);
  };

  const handleEdit = () => {
    console.log("Editing client:", client.id);
    // Open edit modal or navigate to edit page
    // You can dispatch an action or call an API
  };

  const handleSuspend = () => {
    console.log("Suspending client:", client.id);
    // Call API to suspend client
    // await updateClientStatus(client.id, "Suspended");
  };

  const handleDelete = () => {
    console.log("Deleting client:", client.id);
    // Show confirmation dialog and delete
    // if (confirm("Are you sure?")) {
    //   await deleteClient(client.id);
    // }
  };

  const handleContact = (type: "email" | "phone") => {
    if (type === "email") {
      window.open(`mailto:${client.email}`);
    } else {
      window.open(`tel:${client.phone}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleContact("email")}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleContact("phone")}>
          <Phone className="mr-2 h-4 w-4" />
          Call Client
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {client.status !== "Suspended" && (
          <DropdownMenuItem onClick={handleSuspend} className="text-orange-600">
            Suspend Account
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Status badge component
function StatusBadge({ status }: { status: Client["status"] }) {
  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

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
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("lastName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="lowercase text-muted-foreground">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="font-mono">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "totalRentals",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Rentals" />
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("totalRentals")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("status")} />
    ),
  },
  {
    accessorKey: "dateJoined",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("dateJoined")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {new Date(row.getValue("lastActivity")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ClientActions client={row.original} />;
    },
  },
];