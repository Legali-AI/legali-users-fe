"use client";

import { Menu, User } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthWithProfile } from "@/hooks/use-auth";
import { Span } from "./typography";

const PAGE_CONFIGS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Your Profile",
  "/red-flag-alerts": "Red Flag Alerts",
  "/case-timeline": "Case & Timeline",
  "/document-builder": "Document Builder",
  "/file": "File Organization",
  "/legal-dossier": "Legal Dossier",
  "/forum": "Forum & Community",
  "/support": "Support - Ticket",
  "/support-chat": "Support - Chat & Call",
};

const DEFAULT_CONFIG: string = "Dashboard";

export default function DynamicHeader() {
  const pathname = usePathname();
  const { user } = useAuthWithProfile();
  const title = PAGE_CONFIGS[pathname] || DEFAULT_CONFIG;

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Mobile sidebar trigger - visible only on mobile */}
      <div
        className="flex items-center justify-between gap-4 rounded-lg border border-white-400 p-3 lg:hidden lg:p-5"
        style={{
          background: "linear-gradient(90deg, #EDFAFF 0.01%, #FFF 30.33%)",
        }}>
        <SidebarTrigger className="h-8 w-8">
          <Menu className="size-6" size={24} />
          <span className="sr-only hidden">Open sidebar</span>
        </SidebarTrigger>
      </div>
      <div
        className="flex flex-1 items-center justify-between gap-4 rounded-lg border border-white-400 p-3 lg:p-5"
        style={{
          background: "linear-gradient(90deg, #EDFAFF 0.01%, #FFF 30.33%)",
        }}>
        <div className="flex items-center gap-3 lg:gap-4">
          <Span level={"h5"} weight={"semibold"} className="text-brand-navy">
            {title}
          </Span>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center gap-3 lg:gap-4 lg:border-l lg:border-l-white-400 lg:pl-4">
          <div className="flex aspect-square h-auto w-8 items-center justify-center overflow-hidden rounded-full bg-slate-gray-300 lg:w-10">
            {user?.profile_picture_url ? (
              <Image
                src={user.profile_picture_url}
                alt={`${user.first_name} ${user.last_name}`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-gray-50 lg:h-5 lg:w-5" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <Span level={"body"} weight={"semibold"} className="truncate">
              {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
            </Span>
            <Span level={"label"} weight={"normal"} className="truncate text-brand-slate">
              {user?.email || "Loading..."}
            </Span>
          </div>
        </div>
      </div>
    </div>
  );
}
