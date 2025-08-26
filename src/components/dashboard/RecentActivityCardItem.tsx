import { RecentActivityProps } from "@/types/RecentActivity";

export default function RecentActivityCardItem({
  type,
  details,
  icon,
  isRTL
}: RecentActivityProps) {
  return (
    <div className={`h-16 w-full max-w-96 bg-gray-200 flex justify-center items-center`} dir={isRTL ? "rtl" : "ltr"}>
      {/* icons */}
      <div className="w-12 h-12 flex justify-center items-center">{icon}</div>
      {/* details */}
      <div className="flex flex-col w-full">
        <div className="font-bold ">{type}</div>
        <div className="text-on-surface-variant text-sm">{details}</div>
      </div>
    </div>
  );
}
