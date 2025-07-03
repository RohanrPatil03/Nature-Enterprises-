
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Wrench,
  Users,
  FileText,
  Globe,
  MessageSquare,
} from "lucide-react"

import { Logo } from "@/components/logo"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/toolbox", icon: Wrench, label: "Toolbox" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/resources", icon: Globe, label: "Resources" },
  { href: "/forum", icon: MessageSquare, label: "Forum" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getIsActive = (href: string) => {
    // For toolbox, we want to match /toolbox and /toolbox/*
    if (href === '/toolbox') {
        return pathname.startsWith('/toolbox');
    }
    // For other nested routes
    if (href !== '/dashboard') {
        return pathname.startsWith(href);
    }
    return pathname === href;
  }
  
  const currentNavItem = navItems.find(item => getIsActive(item.href));

  const getPageTitle = () => {
    if (pathname.includes('/toolbox/proposal-generator')) return 'Proposal Generator';
    if (pathname.includes('/toolbox/solar-roi-calculator')) return 'Solar ROI Calculator';
    if (currentNavItem) return currentNavItem.label;
    return 'Solar Resource Hub';
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={getIsActive(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl font-headline font-bold">
                    {getPageTitle()}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
