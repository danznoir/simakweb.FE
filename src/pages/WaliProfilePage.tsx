import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  User,
  UserCog,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  GraduationCap,
  School,
  CalendarCheck,
  BookOpenCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ─── Dummy data: linked by santri id ────────────────────────────────────────

const santriData: Record<string, {
  id: string; nama: string; nis: string; kelas: string; divisi: string
  status: "aktif" | "nonaktif" | "lulus"; telepon: string; alamat: string
  avatar: string
}> = {
  "1": { id: "1", nama: "Ahmad Fauzi", nis: "2024001", kelas: "Kelas A", divisi: "Teknologi Informasi", status: "aktif", telepon: "08111000001", alamat: "Jl. Merdeka No. 1, Jakarta", avatar: "AF" },
  "2": { id: "2", nama: "Siti Aisyah", nis: "2024002", kelas: "Kelas B", divisi: "Akuntansi", status: "aktif", telepon: "08111000002", alamat: "Jl. Sudirman No. 5, Bandung", avatar: "SA" },
  "3": { id: "3", nama: "Budi Santoso", nis: "2024003", kelas: "Kelas A", divisi: "Teknologi Informasi", status: "nonaktif", telepon: "08111000003", alamat: "Jl. Pahlawan No. 10, Surabaya", avatar: "BS" },
  "4": { id: "4", nama: "Nur Halimah", nis: "2024004", kelas: "Kelas C", divisi: "Agama", status: "aktif", telepon: "08111000004", alamat: "Jl. Diponegoro No. 7, Yogyakarta", avatar: "NH" },
  "5": { id: "5", nama: "Rizki Ramadhan", nis: "2023010", kelas: "Kelas B", divisi: "Akuntansi", status: "lulus", telepon: "08111000005", alamat: "Jl. Gajah Mada No. 3, Semarang", avatar: "RR" },
}

const waliData: Record<string, {
  nama: string; hubungan: "ayah" | "ibu" | "wali"; telepon: string
  email: string; pekerjaan: string; alamat: string; avatar: string
}> = {
  "1": { nama: "Bapak Hendra Gunawan", hubungan: "ayah", telepon: "08211000001", email: "hendra@email.com", pekerjaan: "Wirausaha", alamat: "Jl. Merdeka No. 1, Jakarta", avatar: "HG" },
  "2": { nama: "Ibu Sari Dewi", hubungan: "ibu", telepon: "08211000002", email: "sari@email.com", pekerjaan: "PNS", alamat: "Jl. Sudirman No. 5, Bandung", avatar: "SD" },
  "3": { nama: "Bapak Zainal Abidin", hubungan: "wali", telepon: "08211000003", email: "zainal@email.com", pekerjaan: "Guru", alamat: "Jl. Pahlawan No. 10, Surabaya", avatar: "ZA" },
  "4": { nama: "Ibu Fatimah Azzahra", hubungan: "ibu", telepon: "08211000004", email: "fatimah@email.com", pekerjaan: "Dokter", alamat: "Jl. Diponegoro No. 7, Yogyakarta", avatar: "FA" },
  "5": { nama: "Bapak Hendra Gunawan", hubungan: "ayah", telepon: "08211000001", email: "hendra@email.com", pekerjaan: "Wirausaha", alamat: "Jl. Merdeka No. 1, Jakarta", avatar: "HG" },
}

const recentActivity: Record<string, Array<{ type: "absensi" | "jurnal" | "nilai"; label: string; date: string; detail: string }>> = {
  "1": [
    { type: "nilai", label: "Evaluasi April 2026", date: "30 Apr 2026", detail: "Rata-rata: 91 — Predikat A" },
    { type: "jurnal", label: "Jurnal Harian", date: "29 Apr 2026", detail: "Kondisi: Baik — Aktif belajar React." },
    { type: "absensi", label: "Kehadiran Hari Ini", date: "29 Apr 2026", detail: "Status: Hadir" },
  ],
  "2": [
    { type: "nilai", label: "Evaluasi April 2026", date: "30 Apr 2026", detail: "Rata-rata: 80 — Predikat B" },
    { type: "jurnal", label: "Jurnal Harian", date: "29 Apr 2026", detail: "Kondisi: Cukup — Perlu bimbingan." },
    { type: "absensi", label: "Kehadiran Hari Ini", date: "29 Apr 2026", detail: "Status: Izin" },
  ],
  "3": [
    { type: "nilai", label: "Evaluasi April 2026", date: "30 Apr 2026", detail: "Rata-rata: 65 — Predikat C" },
    { type: "jurnal", label: "Jurnal Harian", date: "29 Apr 2026", detail: "Kondisi: Kurang — Izin sakit." },
    { type: "absensi", label: "Kehadiran Hari Ini", date: "29 Apr 2026", detail: "Status: Sakit" },
  ],
  "4": [
    { type: "nilai", label: "Evaluasi April 2026", date: "30 Apr 2026", detail: "Rata-rata: 95 — Predikat A" },
    { type: "jurnal", label: "Jurnal Harian", date: "29 Apr 2026", detail: "Kondisi: Baik — Hafalan meningkat." },
    { type: "absensi", label: "Kehadiran Hari Ini", date: "29 Apr 2026", detail: "Status: Hadir" },
  ],
  "5": [
    { type: "nilai", label: "Evaluasi Terakhir", date: "28 Feb 2026", detail: "Rata-rata: 88 — Predikat A" },
    { type: "jurnal", label: "Jurnal Terakhir", date: "28 Feb 2026", detail: "Kondisi: Baik — Telah lulus." },
    { type: "absensi", label: "Kehadiran Terakhir", date: "28 Feb 2026", detail: "Status: Hadir" },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig = {
  aktif: { label: "Aktif", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  nonaktif: { label: "Non-Aktif", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  lulus: { label: "Lulus", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
}

const hubunganConfig = {
  ayah: { label: "Ayah", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  ibu: { label: "Ibu", className: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  wali: { label: "Wali", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
}

const activityIcon = {
  absensi: <CalendarCheck className="h-4 w-4 text-sky-500" />,
  jurnal: <BookOpenCheck className="h-4 w-4 text-emerald-500" />,
  nilai: <BarChart3 className="h-4 w-4 text-violet-500" />,
}

const activityBg = {
  absensi: "bg-sky-50 dark:bg-sky-950/30",
  jurnal: "bg-emerald-50 dark:bg-emerald-950/30",
  nilai: "bg-violet-50 dark:bg-violet-950/30",
}

// ─── Avatar component ─────────────────────────────────────────────────────────

const colorPairs = [
  ["bg-violet-100 dark:bg-violet-900/50", "text-violet-700 dark:text-violet-300"],
  ["bg-sky-100 dark:bg-sky-900/50", "text-sky-700 dark:text-sky-300"],
  ["bg-emerald-100 dark:bg-emerald-900/50", "text-emerald-700 dark:text-emerald-300"],
  ["bg-amber-100 dark:bg-amber-900/50", "text-amber-700 dark:text-amber-300"],
  ["bg-pink-100 dark:bg-pink-900/50", "text-pink-700 dark:text-pink-300"],
]
const getColor = (initials: string) => colorPairs[initials.charCodeAt(0) % colorPairs.length]

function Avatar({ initials, size = "lg" }: { initials: string; size?: "md" | "lg" | "xl" }) {
  const [bg, text] = getColor(initials)
  const sizeClass = size === "xl" ? "h-20 w-20 text-2xl" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm"
  return (
    <div className={`${sizeClass} ${bg} ${text} flex items-center justify-center rounded-full font-bold tracking-wide`}>
      {initials}
    </div>
  )
}

// ─── Info row helper ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WaliProfilePage() {
  const { santriId } = useParams<{ santriId: string }>()
  const navigate = useNavigate()

  const santri = santriId ? santriData[santriId] : null
  const wali = santriId ? waliData[santriId] : null
  const activities = santriId ? (recentActivity[santriId] ?? []) : []

  if (!santri || !wali) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <User className="h-8 w-8 text-muted-foreground opacity-50" />
        </div>
        <p className="text-lg font-semibold">Santri tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">Data santri dengan ID ini tidak tersedia.</p>
        <button
          onClick={() => navigate("/dashboard/santri")}
          className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Santri
        </button>
      </div>
    )
  }

  const statusCfg = statusConfig[santri.status]
  const hubunganCfg = hubunganConfig[wali.hubungan]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        id="btn-back-wali-profile"
        onClick={() => navigate("/dashboard/santri")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Santri
      </button>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-border/60 p-6">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Santri avatar */}
          <Avatar initials={santri.avatar} size="xl" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{santri.nama}</h1>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.className}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground font-mono">NIS: {santri.nis}</p>

            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <School className="h-4 w-4" />
                <span>{santri.kelas}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{santri.divisi}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{santri.telepon}</span>
              </div>
            </div>
          </div>

          {/* Wali badge preview */}
          <div className="flex items-center gap-3 rounded-xl bg-background/80 backdrop-blur-sm px-4 py-3 ring-1 ring-border/60 shadow-sm">
            <Avatar initials={wali.avatar} size="md" />
            <div>
              <p className="text-xs text-muted-foreground">Wali / Orang Tua</p>
              <p className="text-sm font-semibold leading-tight">{wali.nama}</p>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${hubunganCfg.className}`}>
                {hubunganCfg.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left: Wali Profile Detail */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCog className="h-4 w-4 text-primary" />
                Profil Wali
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <Avatar initials={wali.avatar} size="lg" />
                <div>
                  <p className="font-semibold">{wali.nama}</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${hubunganCfg.className}`}>
                    {hubunganCfg.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Nomor Telepon" value={wali.telepon} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={wali.email} />
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Pekerjaan" value={wali.pekerjaan} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Alamat" value={wali.alamat} />
                <InfoRow icon={<Heart className="h-4 w-4" />} label="Hubungan dengan Santri" value={hubunganCfg.label} />
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hubungi Wali</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <a
                href={`tel:${wali.telepon}`}
                className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Phone className="h-4 w-4 text-emerald-500" />
                {wali.telepon}
              </a>
              <a
                href={`mailto:${wali.email}`}
                className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Mail className="h-4 w-4 text-sky-500" />
                {wali.email}
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right: Santri Detail + Activity */}
        <div className="lg:col-span-2 space-y-4">

          {/* Santri Info */}
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Informasi Santri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">NIS</p>
                  <p className="font-mono font-semibold text-sm">{santri.nis}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Kelas</p>
                  <p className="font-semibold text-sm">{santri.kelas}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Divisi</p>
                  <p className="font-semibold text-sm">{santri.divisi}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex text-xs font-medium rounded-full px-2 py-0.5 ${statusCfg.className}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Telepon</p>
                  <p className="font-semibold text-sm">{santri.telepon}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                  <p className="text-sm leading-snug">{santri.alamat}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card className="border-0 shadow-sm ring-1 ring-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Aktivitas Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-6">Belum ada aktivitas tercatat.</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((act, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${activityBg[act.type]}`}>
                      <div className="mt-0.5 flex-shrink-0">{activityIcon[act.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{act.label}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{act.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{act.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Kehadiran Bulan Ini", value: "92%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
              { label: "Tugas Dikumpulkan", value: "5/6", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
              { label: "Nilai Rata-rata", value: activities.find(a => a.type === "nilai")?.detail.split("Rata-rata: ")[1]?.split(" ")[0] ?? "—", icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
            ].map(s => (
              <Card key={s.label} className="border-0 shadow-sm ring-1 ring-border/60 transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                  <div className={`rounded-lg p-1.5 ${s.bg}`}><s.icon className={`h-3.5 w-3.5 ${s.color}`} /></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
