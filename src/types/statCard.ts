export interface StatCardProps {
  id: number,
  title: string;
  value: number | string;
  percentageChange: string;
  timeInterval: string;
  icon: React.ReactNode;
  isRTL?: boolean; // Optional prop for RTL support
}
