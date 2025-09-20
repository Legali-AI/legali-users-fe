import type { Metadata } from "next";
import { dashboardMetadata } from "@/lib/seo/metadata";
import AppSidebar from "../../components/elements/app-sidebar";
import DynamicHeader from "../../components/elements/dynamic-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";

export const metadata: Metadata = dashboardMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="h-screen py-5">
      <AppSidebar />
      <div className="flex flex-1 flex-col gap-5 pr-5">
        <DynamicHeader />

        <SidebarInset
          className="flex flex-1 flex-col gap-4 overflow-hidden overflow-y-auto rounded-lg border border-white-400 p-6"
          style={{
            background: "linear-gradient(180deg, #FFF 47.69%, #EDFAFF 100%)",
          }}
        >
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
