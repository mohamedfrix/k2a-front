"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getReviewById, updateReview, ReviewListItem } from '@/lib/api/reviews';
import { useAuth } from '@/context/AuthContext';

export function ViewReviewDialog({ id, open, onClose, onUpdated }: { id: string | null; open: boolean; onClose: () => void; onUpdated?: (r: ReviewListItem) => void }) {
  const { getAccessToken } = useAuth();
  const [review, setReview] = useState<ReviewListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  React.useEffect(() => {
    if (!open || !id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const token = getAccessToken();
        if (!token) throw new Error('No token');
        const r = await getReviewById(id, token);
        if (!mounted) return;
        setReview(r);
        setAdminNote(r.adminNote || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [open, id]);

  const handleSave = async () => {
    if (!review) return;
    try {
      setSaving(true);
      const token = getAccessToken();
      if (!token) throw new Error('No token');
      const updated = await updateReview(review.id, { adminNote, isPublic: review.isPublic }, token);
      setReview(updated);
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div>Loading...</div>
          ) : review ? (
            <div>
              <p><strong>Nom:</strong> {review.name}</p>
              <p><strong>Email:</strong> {review.email || '—'}</p>
              <p className="mt-4"><strong>Message:</strong></p>
              <div className="p-3 border rounded-md bg-surface-variant">{review.message}</div>

              <div className="mt-4">
                <label className="block mb-2">Note admin</label>
                <textarea className="w-full p-2 border rounded" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
              </div>
            </div>
          ) : (
            <div>No review selected</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReviewDialog;
