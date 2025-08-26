"use client";

import { statIcons } from "@/components/dashboard/icons/statIcons";
import DashboardNavBar from "@/components/dashboard/navbar";
import RecentActivityCardItem from "@/components/dashboard/RecentActivityCardItem";
import RecentActivityCard from "@/components/dashboard/RecentActivityCardItem";
import RentalTypeCard from "@/components/dashboard/RentalTypeCard";
import StatCard from "@/components/dashboard/statCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useLanguage } from "@/context/LanguageContext";
import { RecentActivityProps } from "@/types/RecentActivity";
import { StatCardProps } from "@/types/statCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  formatCurrency, 
  formatNumber, 
  formatPercentage,
  getMockPercentageChange,
  generateRecentActivities,
  calculateUtilizationRate
} from "@/lib/utils/dashboardUtils";

function DashboardContent() {
  const { t, language, isRTL } = useLanguage();
  const { vehicleStats, contractStats, clientStats, loading, error, refetch } = useDashboardStats();

  // Generate stat cards from real data
  const generateStatCards = (): StatCardProps[] => {
    if (!vehicleStats || !contractStats || !clientStats) {
      return [];
    }

    return [
      {
        id: 1,
        title: t("dashboard.stat_card.total_revenue"),
        value: formatCurrency(contractStats.totalRevenue),
        percentageChange: getMockPercentageChange('revenue'),
        timeInterval: "Last 30 days",
        icon: statIcons["revenue"],
        isRTL,
      },
      {
        id: 2,
        title: t("dashboard.stat_card.total_contracts"),
        value: formatNumber(contractStats.totalContracts),
        percentageChange: getMockPercentageChange('contracts'),
        timeInterval: "Last 30 days",
        icon: statIcons["contracts"],
        isRTL,
      },
      {
        id: 3,
        title: t("dashboard.stat_card.total_clients"),
        value: formatNumber(clientStats.totalClients),
        percentageChange: getMockPercentageChange('clients'),
        timeInterval: "Last 30 days",
        icon: statIcons["clients"],
        isRTL,
      },
      {
        id: 4,
        title: t("dashboard.stat_card.total_vehicles"),
        value: formatNumber(vehicleStats.totalVehicles),
        percentageChange: getMockPercentageChange('vehicles'),
        timeInterval: "Last 30 days",
        icon: statIcons["total-vehicles"],
        isRTL,
      },
      {
        id: 5,
        title: t("dashboard.stat_card.available_vehicles"),
        value: formatNumber(vehicleStats.availableVehicles),
        percentageChange: getMockPercentageChange('vehicles'),
        timeInterval: "Last 30 days",
        icon: statIcons["available-vehicles"],
        isRTL,
      },
      {
        id: 6,
        title: t("dashboard.stat_card.active_contracts"),
        value: formatNumber(contractStats.activeContracts ?? 0),
        percentageChange: getMockPercentageChange('contracts'),
        timeInterval: "Last 30 days",
        icon: statIcons["active-contracts"],
        isRTL,
      },
      {
        id: 7,
        title: t("dashboard.stat_card.new_clients"),
        value: formatNumber(clientStats.recentClients),
        percentageChange: getMockPercentageChange('clients'),
        timeInterval: "Last 30 days",
        icon: statIcons["new-clients"],
        isRTL,
      },
      {
        id: 8,
        title: t("dashboard.stat_card.utilization_rate"),
        value: formatPercentage(calculateUtilizationRate(vehicleStats.bookedVehicles, vehicleStats.totalVehicles)),
        percentageChange: getMockPercentageChange('utilization'),
        timeInterval: "Last 30 days",
        icon: statIcons["utilization-rate"],
        isRTL,
      },
    ];
  };

  // Generate recent activities from real data
  const generateRecentActivitiesData = (): RecentActivityProps[] => {
    if (!vehicleStats || !contractStats || !clientStats) {
      return [];
    }

    const activities = generateRecentActivities(contractStats, clientStats, vehicleStats);
    
    return activities.map((activity, index) => ({
      id: index + 1,
      type: activity.type,
      details: activity.details,
      icon: statIcons[activity.icon as keyof typeof statIcons] || statIcons["available-vehicles"],
      isRTL,
    }));
  };

  const items = generateStatCards();
  const recentActivities = generateRecentActivitiesData();

  if (loading) {
    return (
      <div className="w-full flex justify-start flex-col gap-6 p-2">
        <DashboardNavBar
          title={t("dashboard.navbar.dashboard.title")}
          subtitle={t("dashboard.navbar.dashboard.subtitle")}
          isRTL={isRTL}
          t={t}
        />
        <div className="w-full h-full p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-start flex-col gap-6 p-2">
        <DashboardNavBar
          title={t("dashboard.navbar.dashboard.title")}
          subtitle={t("dashboard.navbar.dashboard.subtitle")}
          isRTL={isRTL}
          t={t}
        />
        <div className="w-full h-full p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">Error loading dashboard</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-start flex-col gap-6 p-2">
      <DashboardNavBar
        title={t("dashboard.navbar.dashboard.title")}
        subtitle={t("dashboard.navbar.dashboard.subtitle")}
        isRTL={isRTL}
        t={t}
      />
      <div className="w-full h-full  p-4">
        {/* stat cards */}
        <div
          className="flex justify-start  flex-wrap gap-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {items.map((item) => (
            <StatCard
              key={item.id}
              id={item.id}
              title={item.title}
              value={item.value}
              percentageChange={item.percentageChange}
              timeInterval={item.timeInterval}
              icon={item.icon}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
      {/* Seperator */}
      <div className="h-[2px] rounded-[2px] w-full bg-gray-200"></div>

      {/* Stat cards */}
      <div className="flex flex-col-reverse lg:flex-row gap-7 justify-around ">
        {/* rental type */}
        <RentalTypeCard />
        {/* recent activity */}
        <div className="flex flex-col flex-wrap gap-4 max-w-96 w-full p-4 elevation-2 rounded-[10px]">
          <div className="font-unbounded text-lg font-semibold">
            {t("dashboard.recent_activity.title")}
          </div>
          <div className="flex flex-col gap-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                return (
                  <RecentActivityCardItem
                    id={activity.id}
                    key={activity.id}
                    type={activity.type}
                    details={activity.details}
                    icon={activity.icon}
                    isRTL={isRTL}
                  />
                );
              })
            ) : (
              <div className="text-gray-500 text-center py-4">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
