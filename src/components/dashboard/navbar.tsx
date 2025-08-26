import { DashboardNavBarProps } from "@/types/DashboardNavBar";

export default function DashboardNavBar({
  title,
  subtitle,
  isRTL,
  t,
}: DashboardNavBarProps) {
  return (
    <div className={`flex w-full justify-between items-center`}>
      <div className="flex flex-col justify-center items-start gap-1">
        <div className="font-unbounded font-bold text-xl">{title}</div>
        <div className="font-unbounded text-on-surface-variant text-sm">
          {subtitle}
        </div>
      </div>
      <div className={`flex justify-center items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
    <div className="flex flex-row justify-center items-center gap-2 p-2 bg-gray-200 rounded-[10px]">
          <div className="w-[10px] h-[10px] rounded-[50%] bg-green-500"></div>
          <div className="text-on-surface-variant">{t("dashboard.navbar.dashboard.connection_state")}</div>
        </div>
        <div className="w-10 aspect-square rounded-[50%] text-white bg-orange-500 flex justify-center items-center">AD</div>
      </div>
    </div>
  );
}
