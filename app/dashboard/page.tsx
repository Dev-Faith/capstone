"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

import data from "./data.json";
import MapPage from "@/components/ui/live-map";
import { useEffect } from "react";
import DashboardLayout from "./layout";

export default function Page() {
  const router = useRouter();
  return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
        <SectionCards />
        <div className="px-4 lg:px-6">
          {/* <ChartAreaInteractive /> */}
          <MapPage preview />
        </div>
        <DataTable data={data} />
      </div>
  );
}
