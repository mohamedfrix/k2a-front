"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DataTable } from "@/app/admin/clients/data-table";
import { createColumns } from "./columns";
import { getReviews, ReviewListItem } from "@/lib/api/reviews";
import { useAuth } from "@/context/AuthContext";
import ViewReviewDialog from './view-review-dialog';

function FeedbackAdminContent() {
  const { getAccessToken } = useAuth();
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken();
      if (!token) throw new Error('No auth token');
      const res = await getReviews(token, 1, 100);
      setReviews(res.reviews);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleUpdate = (updated: ReviewListItem) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const columns = createColumns({
    onUpdate: handleUpdate,
    onView: (id: string) => setSelectedId(id),
  });

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des retours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">Erreur</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchReviews} className="px-4 py-2 bg-blue-500 text-white rounded">Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback Admin</h1>
          <p className="text-muted-foreground">Gérez les retours clients et publiez ceux que vous souhaitez afficher publiquement.</p>
        </div>
      </div>

      <div className="mt-8">
        <DataTable columns={columns} data={reviews} />
      </div>

      <ViewReviewDialog id={selectedId} open={!!selectedId} onClose={() => setSelectedId(null)} onUpdated={handleUpdate} />
    </div>
  );
}

export default function FeedbackAdminPage() {
  return (
    <ProtectedRoute>
      <FeedbackAdminContent />
    </ProtectedRoute>
  );
}
