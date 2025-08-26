"use client";
import DashboardNavBar from "@/components/dashboard/navbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useLanguage } from "@/context/LanguageContext";

function DashboardContent() {
  const { t, language, isRTL } = useLanguage();

  return (
    <div
      className="w-full h-full flex justify-center items-center font-unbounded font-bold text-2xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="">{t("admin.welcome")}</div>
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
