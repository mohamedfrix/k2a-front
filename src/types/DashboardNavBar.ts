export interface DashboardNavBarProps {
  title: string;
  subtitle?: string;
  isRTL: boolean;
  t: (key: string) => string;
}