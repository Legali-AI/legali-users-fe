"use client";

import { Menu, X } from "lucide-react";
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
          className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
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
      <div className="flex items-center gap-3">
        {/* User Info */}
        <Link href="/profile" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-blue-100">
            <Typography level="caption" className="font-medium text-sky-blue-600">
              {user.email?.charAt(0).toUpperCase()}
            </Typography>
          </div>
          <Typography level="body" className="hidden text-gray-700 sm:block">
            {user.email}
          </Typography>
        </Link>

        {/* Logout Button */}
        <LogoutButton variant="ghost" className="p-2 text-gray-600 hover:text-gray-900">
          <Typography level="caption">Logout</Typography>
        </LogoutButton>
      </div>
    );
  }

  return (
    <div>
      <Button className="rounded-xl bg-deep-navy-400 hover:bg-deep-navy-500">
        <Link href="/login">
          <Typography weight="medium" level="body" className="text-white">
            Log In
          </Typography>
        </Link>
      </Button>
    </div>
  );
};

const MobileAuthSection = ({ onClose }: { onClose: () => void }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="space-y-3">
        {/* User Info */}
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-blue-100">
            <Typography level="body" className="font-medium text-sky-blue-600">
              {user.email?.charAt(0).toUpperCase()}
            </Typography>
          </div>
          <div>
            <Typography level="body" className="font-medium text-gray-700">
              Profile
            </Typography>
            <Typography level="caption" className="text-gray-500">
              {user.email}
            </Typography>
          </div>
        </Link>

        {/* Logout Button */}
        <div className="px-3">
          <LogoutButton variant="outline" className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50">
            <Typography level="body">Logout</Typography>
          </LogoutButton>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3">
      <Button className="w-full rounded-xl bg-deep-navy-400 hover:bg-deep-navy-500" asChild>
        <Link href="/login" onClick={onClose}>
          <Typography weight="medium" level="body" className="text-white">
            Log In
          </Typography>
        </Link>
      </Button>
    </div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          "fixed top-0 right-0 left-0 z-50 hidden w-full py-4 transition-all duration-300 lg:block",
          isScrolled && "bg-white/70 shadow-lg backdrop-blur-md"
        )}>
        <div className="flex w-full items-center justify-between gap-4 rounded-full px-4 sm:px-8 lg:px-12">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image src={"/logo.png"} alt="Logo" width={60} height={40} />
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <div key={item.title} className="relative">
                {item.subItems && item.subItems.length > 0 ? (
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="peer bg-transparent hover:bg-transparent">
                          <Typography
                            weight="medium"
                            level="body"
                            className="text-slate-gray-400 peer-hover:text-black">
                            {item.title}
                          </Typography>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[300px] gap-2">
                            {item.subItems.map(subItem => (
                              <ListItem key={subItem.title} href={subItem.href} title={subItem.title} />
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <Link href={item.href} className="peer hover:bg-transparent">
                    <Typography weight="medium" level="body" className="text-slate-gray-400">
                      {item.title}
                    </Typography>
                  </Link>
                )}
                <span className="pointer-events-none absolute top-[31px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-deep-navy-400 opacity-0 transition-all duration-200 ease-out peer-hover:opacity-100 peer-focus-visible:opacity-100" />
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <AuthSection />
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={cn(
          "fixed top-[20px] left-1/2 z-50 w-[95vw] w-full -translate-x-1/2 transform rounded-2xl px-4 py-3 transition-all duration-300 lg:hidden",
          isScrolled && "bg-white/70 shadow-lg backdrop-blur-md"
        )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src={"/logo.png"} alt="Logo" width={50} height={35} />
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 rounded-2xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-md">
            <div className="space-y-2 px-4 py-4">
              {/* Navigation Items */}
              {NAV_ITEMS.map(item => (
                <div key={item.title}>
                  {item.subItems && item.subItems.length > 0 ? (
                    <div className="space-y-1">
                      <Typography weight="medium" level="body" className="px-3 py-2 text-slate-gray-400">
                        {item.title}
                      </Typography>
                      {item.subItems.map(subItem => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          onClick={closeMobileMenu}
                          className="block rounded-lg px-6 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100">
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block rounded-lg px-3 py-2 text-slate-gray-400 transition-colors hover:bg-gray-100">
                      <Typography weight="medium" level="body">
                        {item.title}
                      </Typography>
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                <MobileAuthSection onClose={closeMobileMenu} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
