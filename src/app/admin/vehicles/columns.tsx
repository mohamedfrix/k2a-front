"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  AdminVehicle, 
  getFuelTypeDisplayName, 
  getTransmissionDisplayName, 
  getCategoryDisplayName 
} from "@/types/AdminVehicle";

export type Vehicles = AdminVehicle;

interface ColumnsProps {
  onEdit?: (vehicle: AdminVehicle) => void;
  onDelete?: (vehicle: AdminVehicle) => void;
  onView?: (vehicle: AdminVehicle) => void;
}

export const createColumns = (actions?: ColumnsProps): ColumnDef<AdminVehicle>[] => [
  {
    accessorKey: "make",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marque" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("make")}</span>
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modèle" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.getValue("model")}</span>
      </div>
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Année" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.getValue("year")}</span>
      </div>
    ),
  },
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Couleur" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.getValue("color")}</span>
      </div>
    ),
  },
  {
    accessorKey: "licensePlate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plaque" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{row.getValue("licensePlate")}</span>
      </div>
    ),
  },
  {
    accessorKey: "mileage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kilométrage" />
    ),
    cell: ({ row }) => {
      const mileage = row.getValue("mileage") as number | null;
      return (
        <div className="flex items-center gap-2">
          <span>{mileage ? `${mileage.toLocaleString()} km` : "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "transmission",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transmission" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{getTransmissionDisplayName(row.getValue("transmission"))}</span>
      </div>
    ),
  },
  {
    accessorKey: "fuelType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Carburant" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{getFuelTypeDisplayName(row.getValue("fuelType"))}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catégorie" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {getCategoryDisplayName(row.getValue("category"))}
      </Badge>
    ),
  },
  {
    accessorKey: "pricePerDay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prix/Jour" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("pricePerDay") as number;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{price.toLocaleString()} DA</span>
        </div>
      );
    },
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disponibilité" />
    ),
    cell: ({ row }) => {
      const availability = row.getValue("availability") as boolean;
      return (
        <Badge variant={availability ? "default" : "destructive"}>
          {availability ? "Disponible" : "Indisponible"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vedette" />
    ),
    cell: ({ row }) => {
      const featured = row.getValue("featured") as boolean;
      return featured ? (
        <Badge variant="secondary">★ Vedette</Badge>
      ) : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => actions?.onView?.(vehicle)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => actions?.onEdit?.(vehicle)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => actions?.onDelete?.(vehicle)}
              className="text-red-500 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Legacy columns for backward compatibility
export const columns = createColumns();
