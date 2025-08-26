"use client";
import { DashboardSideBar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { t, language, isRTL } = useLanguage();

  return (
    <SidebarProvider dir={isRTL ? "rtl" : "ltr"}>
      <DashboardSideBar />
      <main className="w-full p-2">{children}</main>
    </SidebarProvider>
  );
}
