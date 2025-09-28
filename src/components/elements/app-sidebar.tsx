"use client";
import {
  AlertTriangle,
  BookOpen,
  Clock,
  FileEdit,
  Flag,
  FolderOpen,
  Headphones,
  type LucideIcon,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Typography } from "./typography";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  href?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "red-flag-alerts",
    label: "Red Flag Alerts",
    icon: Flag,
    href: "/red-flag-alerts",
  },
  {
    id: "case-timeline",
    label: "Case & Timeline",
    icon: Clock,
    href: "/case-timeline",
  },
  {
    id: "document-builder",
    label: "Document Builder",
    icon: FileEdit,
    href: "/document-builder",
  },
  {
    id: "file-organization",
    label: "File Organization",
    icon: FolderOpen,
    href: "/file",
  },
  {
    id: "legal-dossier",
    label: "Legal Dossier",
    icon: BookOpen,
    href: "/legal-dossier",
  },
  {
    id: "forum",
    label: "Forum",
    icon: MessageSquare,
    href: "/forum",
  },
  {
    id: "support-ticket",
    label: "Support - Ticket",
    icon: AlertTriangle,
    href: "/support",
  },
  {
    id: "support-chat",
    label: "Support - Chat & Call",
    icon: Headphones,
    href: "/support-chat",
  },
];

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "main",
    label: "Main Menu",
    items: MAIN_MENU_ITEMS,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent className="relative z-10 overflow-hidden p-3">
        <SidebarMenu>
          <SidebarMenuItem className="relative z-10 px-3 pt-5">
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src={"/logo.png"} alt="Logo" width={70} height={50} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          style={{
            background: "radial-gradient(43.99% 42.22% at 90.18% 46.5%, #FFF 0%, #E5F8FF 100%)",
          }}
          className="absolute -top-40 -right-40 -z-[9px] h-[600px] w-[400px] rotate-[130deg] rounded-full blur-2xl"
        />
        <div
          style={{
            background: "radial-gradient(43.99% 42.22% at 90.18% 46.5%, #FFF 0%, #E5F8FF 100%)",
          }}
          className="absolute -bottom-40 -left-40 -z-[9px] h-[600px] w-[400px] -rotate-[68deg] rounded-full blur-2xl"
        />
        {MENU_GROUPS.map(group => (
          <SidebarGroup key={group.id}>
            {/* <SidebarGroupLabel>{group.label}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href || "#"}>
                        {/* <item.icon /> */}
                        <Typography level={"title"}>{item.label}</Typography>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
