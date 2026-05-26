"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  BarChart3,
  LayoutDashboard,
  Wrench,
  ChevronDown,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Logo from "./logo";
import Navbar from "./navbar";
import { Searchbar } from "@/components/layout/searchbar";
import NotificationButton from "./notification-button";
import MobileMenu from "./mobile-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
          <Logo />

          <div className="hidden sm:block">
            <p className="text-md font-semibold leading-none text-foreground">
              TechCorp
            </p>
          </div>
        </Link>

        <Navbar navItems={navItems} />
        <Searchbar />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />

          <NotificationButton />

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-foreground border-0 hover:border-0 hover:bg-transparent hover:text-red-500 dark:hover:bg-transparent"
          >
            <Settings className="text-gray-500 h-4 w-4 hover:text-red-500" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-transparent w-full gap-2"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-xs font-semibold text-white">
                      LV
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Sign out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
