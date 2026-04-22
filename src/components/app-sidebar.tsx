import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navMain = [
  {
    title: "Beranda",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Manajemen",
    items: [
      {
        title: "Data Santri",
        url: "/dashboard/santri",
        icon: Users,
      },
      {
        title: "Divisi",
        url: "/dashboard/divisi",
        icon: Layers,
      },
      {
        title: "Kelas",
        url: "/dashboard/kelas",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Akademik",
    items: [
      {
        title: "Absensi",
        url: "/dashboard/absensi",
        icon: ClipboardCheck,
      },
      {
        title: "Tugas",
        url: "/dashboard/tugas",
        icon: FileText,
      },
      {
        title: "Pelajaran",
        url: "/dashboard/pelajaran",
        icon: BookOpen,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight tracking-tight">
              Manajer Santri
            </span>
            <span className="text-xs text-muted-foreground">
              Sistem Manajemen
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      {/* Base UI pakai `render` prop, bukan `asChild` */}
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={<Link to={item.url} />}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarSeparator />
      <SidebarFooter className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Pengaturan — juga pakai `render` prop */}
            <SidebarMenuButton
              tooltip="Pengaturan"
              render={<Link to="/dashboard/settings" />}
            >
              <Settings className="h-4 w-4" />
              <span>Pengaturan</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            {/* DropdownMenu Base UI TIDAK punya asChild di Trigger-nya */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  A
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none">Admin</span>
                  <span className="text-xs text-muted-foreground">admin@manajer.id</span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-52" align="start">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
