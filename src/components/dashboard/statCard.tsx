import { StatCardProps } from "@/types/statCard";

export default function StatCard({
  title,
  value,
  percentageChange,
  timeInterval,
  icon,
  isRTL,
}: StatCardProps) {
  return (
    <div
      className={`w-3xs h-32  elevation-1 rounded-[12px] flex justify-between items-start gap-4 p-2 mb-4 `}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* content */}
      <div
        className="h-full flex flex-col gap-2 justify-center items-start"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-on-surface-variant font-medium text-sm">
          {title}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">
          <span
            className={`${
              parseInt(percentageChange) >= 0
                ? "text-green-400"
                : "text-red-400"
            } font-medium mx-1`}
          >
            {percentageChange}
          </span>
          {timeInterval}
        </div>
      </div>
      {/* icon */}
      <div className="p-2  bg-orange-500 text-color flex justify-center items-center rounded-[8px] mt-2">
        {icon}
      </div>
    </div>
  );
}
