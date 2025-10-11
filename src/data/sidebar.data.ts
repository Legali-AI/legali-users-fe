import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

// Types
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

// Constants
export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/profile",
  },
  {
    id: "attorneys",
    label: "Attorneys",
    icon: Users,
    href: "/attorneys",
  },
  {
    id: "legal-documents",
    label: "Legal Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    href: "/appointments",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
];

export const ACCOUNT_MENU_ITEMS: MenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    subItems: [
      {
        id: "personal-info",
        label: "Personal Info",
        href: "/profile/personal",
      },
      {
        id: "preferences",
        label: "Preferences",
        href: "/profile/preferences",
      },
      {
        id: "security",
        label: "Security",
        href: "/profile/security",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Shield,
    href: "/privacy",
  },
  {
    id: "help-support",
    label: "Help & Support",
    icon: HelpCircle,
    href: "/help",
  },
];

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "main",
    label: "Main Menu",
    items: MAIN_MENU_ITEMS,
  },
  {
    id: "account",
    label: "Account",
    items: ACCOUNT_MENU_ITEMS,
  },
];
