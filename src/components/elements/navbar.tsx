"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/module/auth/logout-button";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "../../lib/utils";
import { Typography } from "./typography";

const ListItem = ({ href, title }: { href: string; title: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Typography level={"body"}>{title}</Typography>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const AuthSection = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <NavigationMenuItem className="flex items-center gap-3">
        {/* User Info */}
        <Link
          href="/profile"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-blue-100">
            <Typography
              level="caption"
              className="font-medium text-sky-blue-600"
            >
              {user.email?.charAt(0).toUpperCase()}
            </Typography>
          </div>
          <Typography level="body" className="hidden text-gray-700 sm:block">
            {user.email}
          </Typography>
        </Link>

        {/* Logout Button */}
        <LogoutButton
          variant="ghost"
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <Typography level="caption">Logout</Typography>
        </LogoutButton>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <Button className="rounded-xl bg-deep-navy-400 hover:bg-deep-navy-500">
        <Link href="/login">
          <Typography weight="medium" level="body" className="text-white">
            Log In
          </Typography>
        </Link>
      </Button>
    </NavigationMenuItem>
  );
};

type NavItemType = {
  title: string;
  href: string;
  subItems?: NavItemType[] | null;
};

const NAV_ITEMS: NavItemType[] = [
  {
    title: "Solutions",
    href: "/solutions",
    subItems: [
      {
        title: "Solution 1",
        href: "/solutions/solution-1",
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Integration",
    href: "/integration",
  },
  {
    title: "Attorney",
    href: "/attorney",
  },
  {
    title: "Support",
    href: "/support",
    subItems: [
      {
        title: "Support 1",
        href: "/support/solution-1",
      },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NavigationMenu
      viewport={false}
      className={cn(
        "fixed top-[20px] left-1/2 z-50 w-[90vw] -translate-x-1/2 transform rounded-full px-20 py-2 transition-all duration-300",
        isScrolled && "shadow-lg backdrop-blur-md"
      )}
    >
      <NavigationMenuList className="flex w-[90vw] items-center justify-around gap-4 px-10 md:gap-6 lg:gap-8">
        {/* Logo */}
        <NavigationMenuItem>
          <NavigationMenuLink href="/">
            <Image src={"/logo.png"} alt="Logo" width={60} height={40} />
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Routing */}
        <div className="flex flex-1 items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <NavigationMenuItem key={item.title} className="relative">
              {/* Sub menu dropdown routing */}
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="peer bg-transparent hover:bg-transparent">
                    <Typography
                      weight="medium"
                      level="body"
                      className="text-slate-gray-400 peer-hover:text-black"
                    >
                      {item.title}
                    </Typography>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[300px]">
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          href={subItem.href}
                          title={subItem.title}
                        ></ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                // Basic Routing
                <NavigationMenuLink
                  href={item.href}
                  className="peer hover:bg-transparent"
                >
                  <Typography
                    weight="medium"
                    level="body"
                    className="text-slate-gray-400"
                  >
                    {item.title}
                  </Typography>
                </NavigationMenuLink>
              )}
              <span className="pointer-events-none absolute top-[31px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-deep-navy-400 opacity-0 transition-all duration-200 ease-out peer-hover:opacity-100 peer-focus-visible:opacity-100" />
            </NavigationMenuItem>
          ))}
        </div>

        {/* Auth Section */}
        <AuthSection />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
