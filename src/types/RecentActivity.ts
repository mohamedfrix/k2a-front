import React from "react";

export interface RecentActivityProps {
  id: number;
  type: string;
  details: string;
  icon: React.ReactElement;
  isRTL?: boolean; // Optional prop for RTL support
}
