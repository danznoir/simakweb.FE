import { useEffect, useState } from "react"
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  TrendingUp,
  ClipboardCheck,
  FileText,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCard {
  title: string
  value: string | number
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ElementType
  color: string
  bg: string
}

const recentActivities = [
  {
    id: 1,
    type: "santri",
    message: "Santri baru Ahmad Fauzi terdaftar di Kelas A",
    time: "5 menit lalu",
    status: "success",
  },
  {
    id: 2,
    type: "absensi",
    message: "Absensi Kelas B - Divisi Programmer telah dicatat",
    time: "30 menit lalu",
    status: "success",
  },
  {
    id: 3,
    type: "tugas",
    message: "Tugas 'React Fundamentals' ditambahkan ke Kelas A",
    time: "1 jam lalu",
    status: "warning",
  },
  {
    id: 4,
    type: "santri",
    message: "Data santri Siti Aminah diperbarui",
    time: "2 jam lalu",
    status: "info",
  },
  {
    id: 5,
    type: "kelas",
    message: "Kelas C dibuat di Divisi Bisnis Digital",
    time: "3 jam lalu",
    status: "success",
  },
]

const statusIcon = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  info: <Clock className="h-4 w-4 text-sky-500" />,
}

const quickActions = [
  {
    title: "Tambah Santri",
    desc: "Daftarkan santri baru ke sistem",
    icon: Users,
    href: "/dashboard/santri",
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "Catat Absensi",
    desc: "Input kehadiran kelas hari ini",
    icon: ClipboardCheck,
    href: "/dashboard/absensi",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Buat Tugas",
    desc: "Tambahkan tugas baru untuk kelas",
    icon: FileText,
    href: "/dashboard/tugas",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Kelola Kelas",
    desc: "Atur kelas dan divisi pesantren",
    icon: GraduationCap,
    href: "/dashboard/kelas",
    color: "from-orange-500 to-amber-600",
  },
]

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSantri: 0,
    totalDivisi: 0,
    totalKelas: 0,
    totalPelajaran: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalSantri: 128,
        totalDivisi: 4,
        totalKelas: 12,
        totalPelajaran: 24,
      })
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const statCards: StatCard[] = [
    {
      title: "Total Santri",
      value: loading ? "—" : stats.totalSantri,
      change: "+8 bulan ini",
      trend: "up",
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      title: "Total Divisi",
      value: loading ? "—" : stats.totalDivisi,
      change: "Stabil",
      trend: "neutral",
      icon: Layers,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      title: "Total Kelas",
      value: loading ? "—" : stats.totalKelas,
      change: "+2 bulan ini",
      trend: "up",
      icon: GraduationCap,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Total Pelajaran",
      value: loading ? "—" : stats.totalPelajaran,
      change: "+3 minggu ini",
      trend: "up",
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/40",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Selamat datang kembali,{" "}
          <span className="font-medium text-foreground">Admin</span> 👋 — berikut
          ringkasan data hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="group relative overflow-hidden border-0 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold tracking-tight transition-all duration-500 ${
                  loading ? "animate-pulse text-muted-foreground/40" : ""
                }`}
              >
                {card.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {card.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                )}
                <span
                  className={
                    card.trend === "up" ? "text-emerald-600 font-medium" : ""
                  }
                >
                  {card.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-base font-semibold">Aksi Cepat</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="group relative flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:ring-primary/30"
              >
                <div
                  className={`rounded-lg bg-gradient-to-br ${action.color} p-2.5 text-white shadow-sm`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">
                    {action.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">
                    {action.desc}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardContent className="p-4">
              <ul className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <li key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {statusIcon[activity.status as keyof typeof statusIcon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{activity.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    {i < recentActivities.length - 1 && (
                      <div className="absolute left-[1.625rem] mt-5 h-full w-px bg-border" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
