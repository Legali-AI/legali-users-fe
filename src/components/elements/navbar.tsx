"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type NavItemType = {
  title: string;
  href: string;
  subItems?: NavItemType[] | null;
};

const NAV_ITEMS: NavItemType[] = [
  // {
  //   title: "Pricing",
  //   href: "/pricing",
  //   // subItems: [
  //   //   {
  //   //     title: "Solution 1",
  //   //     href: "/solutions/solution-1",
  //   //   },
  //   // ],
  // },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Integration",
    href: "/integration",
  },
  {
    title: "Resources",
    href: "/resources",
  },
  {
    title: "Litigation 101",
    href: "/litigation",
    subItems: [
      {
        title: "Crowdfunding for Legal Fees",
        href: "/litigation-crowdfunding",
      },
      {
        title: "Lawyers Marketplace",
        href: "/lawyers",
      },
    ],
  },
];

const AUTHENTICATED_NAV_ITEMS: NavItemType[] = [
  {
    title: "History Chats",
    href: "/history-chats",
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuthStatus();
  const { logout } = useAuth();
  const router = useRouter();

  // Combine nav items based on authentication status
  const navItems = isAuthenticated
    ? [...NAV_ITEMS, ...AUTHENTICATED_NAV_ITEMS]
    : NAV_ITEMS;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout(() => {
      // Redirect to login page after successful logout
      router.push("/login");
    });
  };

  return (
    <NavigationMenu
      viewport={false}
      className={cn(
        "bg-rgba(245, 245, 245, 0.5) fixed top-4 left-1/2 z-50 w-[90vw] -translate-x-1/2 transform rounded-xl px-1 py-2 shadow-lg backdrop-blur-md transition-all duration-300 sm:top-5 sm:px-2 md:px-3 lg:px-4 xl:px-5",
        isScrolled && "bg-white/70 shadow-lg backdrop-blur-md"
      )}
    >
      <NavigationMenuList className="flex w-full items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Logo */}
        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink href="/">
            <Image
              src={"/legali.png"}
              alt="Logo"
              width={60}
              height={40}
              className="h-7 w-auto"
              priority
            />
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Routing - Hidden on mobile, visible on tablet+ */}
        <div className="hidden flex-1 items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:flex lg:gap-8">
          {navItems.map(item => (
            <NavigationMenuItem key={item.title} className="relative">
              {/* Sub menu dropdown routing */}
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="peer bg-transparent px-2 py-1 hover:bg-transparent">
                    <Typography
                      weight="medium"
                      level="body"
                      className="text-slate-gray-400 peer-hover:text-black"
                    >
                      {item.title}
                    </Typography>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 sm:w-[250px] md:w-[300px]">
                      {item.subItems.map(subItem => (
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
                  className="peer px-2 py-1 hover:bg-transparent"
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

        {/* Mobile Menu Button - Visible only on mobile */}
        <NavigationMenuItem className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only hidden">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] rounded-xl px-5 sm:w-[400px]"
            >
              <SheetTitle className="sr-only hidden">
                Navigation Menu
              </SheetTitle>
              <div className="mt-6 flex flex-col space-y-6">
                {/* Logo in mobile menu */}
                <div className="flex items-center space-x-2">
                  <Image
                    src={"/legali.png"}
                    alt="Logo"
                    width={40}
                    height={30}
                    className="h-8 w-auto"
                  />
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col space-y-4">
                  {navItems.map(item => (
                    <div key={item.title} className="space-y-2">
                      <Link
                        href={item.href}
                        className="block py-2 font-medium text-slate-700 transition-colors hover:text-slate-900"
                      >
                        {item.title}
                      </Link>
                      {/* Sub items */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="ml-4 space-y-1">
                          {item.subItems.map(subItem => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block py-1 text-slate-600 transition-colors hover:text-slate-800"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Auth Section */}
                <div className="space-y-3 border-t pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 py-2 text-slate-700 hover:text-slate-900"
                      >
                        <User className="h-4 w-4" />
                        <Typography weight="medium" level="body">
                          Profile
                        </Typography>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 py-2 text-slate-700 hover:text-slate-900"
                      >
                        <LogOut className="h-4 w-4" />
                        <Typography weight="medium" level="body">
                          Log Out
                        </Typography>
                      </button>
                    </>
                  ) : (
                    <Button className="w-full rounded-xl bg-deep-navy-400 hover:bg-deep-navy-500">
                      <Link href="/login" className="w-full">
                        <Typography
                          weight="medium"
                          level="body"
                          className="text-white"
                        >
                          Log In
                        </Typography>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </NavigationMenuItem>

        {/* Auth Section */}
        <NavigationMenuItem className="flex-shrink-0 max-lg:hidden">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-xl px-3 py-1.5 sm:px-4 sm:py-2"
                >
                  <User className="mr-2 h-4 w-4" />
                  <Typography weight="medium" level="body">
                    Account
                  </Typography>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="rounded-xl bg-deep-navy-400 px-3 py-1.5 hover:bg-deep-navy-500 sm:px-4 sm:py-2">
              <Link href="/login">
                <Typography weight="medium" level="body" className="text-white">
                  Log In
                </Typography>
              </Link>
            </Button>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
