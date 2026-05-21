"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  Search,
  Settings,
  BarChart3,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Tools",
    href: "/tools",
    icon: Wrench,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-500 shadow-violet-500/20">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.69666 0.040354C8.90859 0.131038 9.03105 0.354856 8.99315 0.582235L8.09019 6.00001H12.4999C12.6893 6.00001 12.8625 6.10701 12.9472 6.2764C13.0318 6.44579 13.0136 6.6485 12.8999 6.8L6.89997 14.8C6.76166 14.9844 6.5152 15.0503 6.30327 14.9596C6.09134 14.869 5.96888 14.6451 6.00678 14.4178L6.90974 8.99999H2.49999C2.31061 8.99999 2.13747 8.89299 2.05278 8.7236C1.96808 8.55421 1.98636 8.3515 2.09999 8.2L8.09996 0.200037C8.23827 0.0156255 8.48473 -0.0503301 8.69666 0.040354ZM3.49999 8H7.49996C7.64694 8 7.78647 8.06466 7.88147 8.17681C7.97647 8.28895 8.01732 8.43722 7.99316 8.58219L7.33026 12.5596L11.4999 7H7.49996C7.35299 7 7.21346 6.93534 7.11846 6.82319C7.02346 6.71105 6.98261 6.56278 7.00677 6.41781L7.66967 2.44042L3.49999 8Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none text-foreground">
              TechCorp
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2 text-text-navlink hover:text-text-navlink-hover hover:bg-bg-navlink-hover px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-bg-navlink-active text-text-navlink-active"
                    : "text-text-navlink hover:text-text-navlink-hover hover:bg-bg-navlink-hover",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools, metrics..."
              className="h-10 rounded-full border-border/70 bg-card/70 pl-9"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />

          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[10px]">
              3
            </Badge>
          </Button>

          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-semibold text-white">
              LV
            </AvatarFallback>
          </Avatar>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 p-6">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <div className="mt-8 space-y-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tools, metrics..."
                    className="pl-9"
                  />
                </div>

                <nav className="grid gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={[
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
