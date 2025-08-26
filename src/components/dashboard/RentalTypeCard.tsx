import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/lib/utils/dashboardUtils";

export default function RentalTypeCard() {
  const { t, isRTL } = useLanguage();
  const [currentActive, setcurrentActive] = useState(0);
  const { contractStats, loading } = useDashboardStats();

  const intervals = [
    {
      id: 1,
      title: "7 days",
    },
    {
      id: 2,
      title: "30 days",
    },
    {
      id: 3,
      title: "90 days",
    },
  ];

  // Generate chart data from contract statistics
  const generateChartData = () => {
    if (!contractStats?.serviceTypeBreakdown) {
      return [];
    }

    return contractStats.serviceTypeBreakdown.map((item, index) => ({
      id: index + 1,
      serviceType: item.serviceType,
      count: item.count,
      revenue: item.revenue,
      percentage: contractStats.totalContracts > 0 
        ? (item.count / contractStats.totalContracts) * 100 
        : 0
    }));
  };

  const chartData = generateChartData();

  return (
    <div className="w-full flex flex-col gap-4 max-w-2xl elevation-2 p-5 rounded-[10px]">
      {/* Header */}
      <div className="flex flex-row flex-wrap gap-16 ">
        <div className="">
          <div className="font-unbounded text-lg font-semibold">
            {t("dashboard.rental_type.title")}
          </div>
          <div className="text-sm">{t("dashboard.rental_type.subtitle")}</div>
        </div>
        <div className=" flex-1 flex justify-between items-center p-2 ">
          {intervals.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`p-2 ${
                  currentActive === index
                    ? "bg-primary text-white"
                    : "bg-white text-accent-foreground border border-outline "
                } rounded-[5px]`}
                onClick={() => setcurrentActive(index)}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Chart */}
      <div className="w-full h-full min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="space-y-4">
            {chartData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium capitalize">{item.serviceType.toLowerCase()}</div>
                    <div className="text-sm text-gray-500">
                      {item.count} contracts • {formatCurrency(item.revenue)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.percentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">of total</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">No rental type data available</div>
          </div>
        )}
      </div>
    </div>
  );
}
