"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../vehicles/data-table-column-header";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ReviewListItem, updateReview } from '@/lib/api/reviews';
import React from 'react';

// Move hook usage into a component so rules-of-hooks are satisfied
import { useAuth } from '@/context/AuthContext';

interface ColumnsProps {
  onUpdate?: (updated: ReviewListItem) => void;
  onView?: (id: string) => void;
}

export const createColumns = (actions?: ColumnsProps): ColumnDef<ReviewListItem>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue('email') || '—'}</div>,
  },
  {
    accessorKey: 'message',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue('message')}</div>,
  },
  {
    accessorKey: 'isPublic',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Publique" />,
    cell: ({ row }) => (
      <div>{row.getValue('isPublic') ? 'Oui' : 'Non'}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Créé" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleString()}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const review = row.original as ReviewListItem;
      return <ActionsCell review={review} actions={actions} />;
    },
  },
];

export const columns = createColumns();

function ActionsCell({ review, actions }: { review: ReviewListItem; actions?: ColumnsProps }) {
  const { getAccessToken } = useAuth();

  const handleTogglePublic = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token');
      const updated = await updateReview(review.id, { isPublic: !review.isPublic }, token);
      actions?.onUpdate?.(updated);
    } catch (err) {
      console.error('Failed to update review', err);
    }
  };

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
        <DropdownMenuItem onClick={() => actions?.onView?.(review.id)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" /> Voir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublic} className="cursor-pointer">
          {review.isPublic ? 'Retirer publication' : 'Publier'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
