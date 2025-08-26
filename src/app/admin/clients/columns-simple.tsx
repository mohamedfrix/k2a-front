"use client";

import { MoreHorizontal, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../vehicles/data-table-column-header";
import { EditClientDialog } from "./edit-client-dialog";

// Define the shape of our client data
export type Client = {
  id: string;
  nom: string;                    // Last name
  prenom: string;                 // First name
  dateNaissance: string;          // Date of birth
  telephone: string;              // Phone number
  email?: string;                 // Email (optional)
  adresse: string;                // Address
  datePermis: string;             // Driver license date
  status: "Actif" | "Inactif" | "Suspendu";
};

// Client-specific action handlers
interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
}

function ClientActions({ client, onEdit }: ClientActionsProps) {
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
        
        <EditClientDialog
          client={client}
          onSave={onEdit}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier Client
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Status badge component
function StatusBadge({ status }: { status: Client["status"] }) {
  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Inactif":
        return "bg-gray-100 text-gray-800";
      case "Suspendu":
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

// Simple column definitions without complex typing
export const createColumns = (onEdit: (client: Client) => void) => [
  {
    accessorKey: "nom",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }: any) => (
      <div className="font-medium">
        {row.getValue("nom")}
      </div>
    ),
  },
  {
    accessorKey: "prenom",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }: any) => (
      <div className="font-medium">
        {row.getValue("prenom")}
      </div>
    ),
  },
  {
    accessorKey: "dateNaissance",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date de Naissance" />
    ),
    cell: ({ row }: any) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("dateNaissance")).toLocaleDateString('fr-FR')}
      </div>
    ),
  },
  {
    accessorKey: "telephone",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Téléphone" />
    ),
    cell: ({ row }: any) => (
      <div className="font-mono">
        {row.getValue("telephone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }: any) => {
      const email = row.getValue("email");
      return (
        <div className="lowercase text-muted-foreground">
          {email || <span className="text-gray-400 italic">Non renseigné</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "adresse",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Adresse" />
    ),
    cell: ({ row }: any) => (
      <div className="max-w-xs truncate" title={row.getValue("adresse")}>
        {row.getValue("adresse")}
      </div>
    ),
  },
  {
    accessorKey: "datePermis",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date de Permis" />
    ),
    cell: ({ row }: any) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("datePermis")).toLocaleDateString('fr-FR')}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }: any) => (
      <StatusBadge status={row.getValue("status")} />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: any) => {
      return <ClientActions client={row.original} onEdit={onEdit} />;
    },
  },
];