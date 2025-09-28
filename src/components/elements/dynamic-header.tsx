"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Span } from "./typography";

const PAGE_CONFIGS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Your Profile",
  "/attorneys": "Attorneys",
  "/documents": "Legal Documents",
  "/appointments": "Appointments",
  "/messages": "Messages",
};

const DEFAULT_CONFIG: string = "Dashboard";

export default function DynamicHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = PAGE_CONFIGS[pathname] || DEFAULT_CONFIG;

  return (
    <div
      className="flex justify-between gap-4 rounded-lg border border-white-400 p-6"
      style={{
        background: "linear-gradient(90deg, #EDFAFF 0.01%, #FFF 30.33%)",
      }}>
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Span level={"h5"} weight={"semibold"} className="text-brand-navy">
          {title}
        </Span>
      </div>

      <div className="flex items-center gap-4 border-l border-l-white-400 pl-4">
        <div className="flex aspect-square h-auto w-10 items-center justify-center overflow-hidden rounded-full bg-slate-gray-300">
          {user?.profile_picture_url ? (
            <Image
              src={user.profile_picture_url}
              alt={`${user.first_name} ${user.last_name}`}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="text-gray-50" />
          )}
        </div>
        <div className="flex flex-col">
          <Span level={"body"} weight={"semibold"}>
            {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
          </Span>
          <Span level={"label"} weight={"normal"} className="text-brand-slate">
            {user?.email || "Loading..."}
          </Span>
        </div>
      </div>
    </div>
  );
}
