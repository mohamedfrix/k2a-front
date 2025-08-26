// Public API utilities for contract operations (frontend pages)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  details?: any;
}

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Une erreur est survenue');
  }

  return data.data as T;
};

// Check vehicle availability for date range
export const checkVehicleAvailability = async (
  vehicleId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; conflictingContracts?: any[] }> => {
  const queryParams = new URLSearchParams({ startDate, endDate });

  const response = await fetch(
    `${API_BASE_URL}/contracts/vehicle/${vehicleId}/availability?${queryParams.toString()}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  return handleApiResponse<{ available: boolean; conflictingContracts?: any[] }>(response);
};

// Get vehicle calendar data for a specific month
export const getVehicleCalendar = async (
  vehicleId: string,
  year: number,
  month: number
): Promise<{
  date: string;
  available: boolean;
  contractId?: string;
  startDate?: string;
  endDate?: string;
}[]> => {
  const response = await fetch(
    `${API_BASE_URL}/contracts/vehicle/${vehicleId}/calendar?year=${year}&month=${month}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );
  // The backend may return either an array of day items or an object containing a `days` array.
  // Normalize both shapes to the frontend-friendly array: { date: 'YYYY-MM-DD', available: boolean, ... }
  const data = await handleApiResponse<any>(response);

  // Helper: normalize calendar-like responses and ignore CANCELLED contracts when deciding availability
  const normalizeCalendarDays = (raw: any) => {
    const sourceDays = Array.isArray(raw) ? raw : (raw?.days || []);
    if (!Array.isArray(sourceDays)) return [];

    return sourceDays.map((d: any) => {
      // contracts included for the day (may be undefined)
      const rawContracts = Array.isArray(d.contracts) ? d.contracts : [];
      const nonCancelled = rawContracts.filter((c: any) => String(c?.status || '').toUpperCase() !== 'CANCELLED');

      // Format date to local YYYY-MM-DD to avoid timezone shifts from toISOString()
      let dateStr = '';
      try {
        if (!d?.date) dateStr = '';
        else {
          const dd = new Date(d.date);
          if (!isNaN(dd.getTime())) {
            const y = dd.getFullYear();
            const m = String(dd.getMonth() + 1).padStart(2, '0');
            const day = String(dd.getDate()).padStart(2, '0');
            dateStr = `${y}-${m}-${day}`;
          } else {
            dateStr = '';
          }
        }
      } catch (e) {
        dateStr = '';
      }

      return {
        date: dateStr,
        // Prefer backend isAvailable if present; otherwise derive from non-cancelled contracts
        available: typeof d.isAvailable === 'boolean' ? d.isAvailable : (nonCancelled.length === 0),
        contractId: nonCancelled[0]?.id || undefined,
        startDate: d.startDate ? String(d.startDate) : undefined,
        endDate: d.endDate ? String(d.endDate) : undefined
      };
    });
  };

  return normalizeCalendarDays(data);
};

// Get vehicle calendar data for a date range
export const getVehicleCalendarRange = async (
  vehicleId: string,
  startDate: string,
  endDate: string
): Promise<{
  date: string;
  available: boolean;
  contractId?: string;
  startDate?: string;
  endDate?: string;
}[]> => {
  const queryParams = new URLSearchParams({ startDate, endDate });

  const response = await fetch(
    `${API_BASE_URL}/contracts/vehicle/${vehicleId}/calendar?${queryParams.toString()}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  // Reuse the same normalization logic as getVehicleCalendar so cancelled contracts are ignored
  const data = await handleApiResponse<any>(response);
  // replicate normalization (kept local to avoid exporting helper)
  const sourceDays = Array.isArray(data) ? data : (data?.days || []);
  if (!Array.isArray(sourceDays)) return [];

  return sourceDays.map((d: any) => {
    const rawContracts = Array.isArray(d.contracts) ? d.contracts : [];
    const nonCancelled = rawContracts.filter((c: any) => String(c?.status || '').toUpperCase() !== 'CANCELLED');

    // Local YYYY-MM-DD formatting
    let dateStr = '';
    try {
      if (!d?.date) dateStr = '';
      else {
        const dd = new Date(d.date);
        if (!isNaN(dd.getTime())) {
          const y = dd.getFullYear();
          const m = String(dd.getMonth() + 1).padStart(2, '0');
          const day = String(dd.getDate()).padStart(2, '0');
          dateStr = `${y}-${m}-${day}`;
        } else {
          dateStr = '';
        }
      }
    } catch (e) {
      dateStr = '';
    }

    return {
      date: dateStr,
      available: typeof d.isAvailable === 'boolean' ? d.isAvailable : (nonCancelled.length === 0),
      contractId: nonCancelled[0]?.id || undefined,
      startDate: d.startDate ? String(d.startDate) : undefined,
      endDate: d.endDate ? String(d.endDate) : undefined
    };
  });
};
