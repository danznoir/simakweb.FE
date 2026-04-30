import { useState } from "react"
import { toast } from "sonner"
import {
  BarChart3,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Nilai {
  id: number
  santri: string
  nis: string
  kelas: string
  bulan: string
  akademik: number
  akhlak: number
  kehadiran: number
  rataRata: number
  predikat: "A" | "B" | "C" | "D"
  catatan: string
}

const getPredikat = (avg: number): Nilai["predikat"] => {
  if (avg >= 85) return "A"
  if (avg >= 70) return "B"
  if (avg >= 55) return "C"
  return "D"
}

const calcAvg = (a: number, b: number, c: number) => Math.round((a + b + c) / 3)

const initialData: Nilai[] = [
  { id: 1, santri: "Ahmad Fauzi", nis: "2024001", kelas: "Kelas A – TI", bulan: "2026-04", akademik: 88, akhlak: 90, kehadiran: 95, rataRata: 91, predikat: "A", catatan: "Santri terbaik bulan ini." },
  { id: 2, santri: "Siti Aisyah", nis: "2024002", kelas: "Kelas B – AK", bulan: "2026-04", akademik: 75, akhlak: 80, kehadiran: 85, rataRata: 80, predikat: "B", catatan: "Perlu peningkatan akademik." },
  { id: 3, santri: "Budi Santoso", nis: "2024003", kelas: "Kelas A – TI", bulan: "2026-04", akademik: 60, akhlak: 70, kehadiran: 65, rataRata: 65, predikat: "C", catatan: "Sering absen. Perlu perhatian." },
  { id: 4, santri: "Nur Halimah", nis: "2024004", kelas: "Kelas C – AG", bulan: "2026-04", akademik: 92, akhlak: 95, kehadiran: 98, rataRata: 95, predikat: "A", catatan: "Sangat berprestasi." },
]

const predikatConfig: Record<Nilai["predikat"], string> = {
  A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  B: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  C: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  D: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

const emptyForm: Omit<Nilai, "id" | "rataRata" | "predikat"> = { santri: "", nis: "", kelas: "", bulan: new Date().toISOString().slice(0, 7), akademik: 0, akhlak: 0, kehadiran: 0, catatan: "" }

export default function NilaiPage() {
  const [data, setData] = useState<Nilai[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterPredikat, setFilterPredikat] = useState("semua")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Nilai | null>(null)
  const [form, setForm] = useState<Omit<Nilai, "id" | "rataRata" | "predikat">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const avgAll = data.length ? Math.round(data.reduce((a, d) => a + d.rataRata, 0) / data.length) : 0
  const statCards = [
    { label: "Total Rekap", value: data.length, icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Predikat A", value: data.filter(d => d.predikat === "A").length, icon: Star, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Rata-rata", value: avgAll, icon: TrendingUp, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
    { label: "Perlu Perhatian", value: data.filter(d => d.predikat === "C" || d.predikat === "D").length, icon: TrendingDown, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
  ]

  const filtered = data.filter(n => {
    const matchSearch = n.santri.toLowerCase().includes(search.toLowerCase()) || n.kelas.toLowerCase().includes(search.toLowerCase())
    const matchPred = filterPredikat === "semua" || n.predikat === filterPredikat
    return matchSearch && matchPred
  })

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (n: Nilai) => { setEditTarget(n); setForm({ santri: n.santri, nis: n.nis, kelas: n.kelas, bulan: n.bulan, akademik: n.akademik, akhlak: n.akhlak, kehadiran: n.kehadiran, catatan: n.catatan }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.santri || !form.kelas || !form.bulan) { toast.error("Harap lengkapi semua field wajib."); return }
    const avg = calcAvg(form.akademik, form.akhlak, form.kehadiran)
    const pred = getPredikat(avg)
    if (editTarget) {
      setData(prev => prev.map(n => n.id === editTarget.id ? { ...n, ...form, rataRata: avg, predikat: pred } : n))
      toast.success("Nilai berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(n => n.id)) + 1, ...form, rataRata: avg, predikat: pred }])
      toast.success("Evaluasi nilai berhasil disimpan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(n => n.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Rekap nilai berhasil dihapus.") }

  const ScoreBar = ({ value }: { value: number }) => (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-sky-500" : value >= 55 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono">{value}</span>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Evaluasi Bulanan</h1>
        </div>
        <p className="text-sm text-muted-foreground">Rekap penilaian dan evaluasi perkembangan santri setiap bulan.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => (
          <Card key={card.label} className="border-0 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}><card.icon className={`h-4 w-4 ${card.color}`} /></div>
            </CardHeader>
            <CardContent><div className="text-3xl font-bold tracking-tight">{card.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input id="search-nilai" type="text" placeholder="Cari santri atau kelas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
          </div>
          <Select value={filterPredikat} onValueChange={setFilterPredikat}>
            <SelectTrigger id="filter-predikat-nilai" className="w-40">
              <SelectValue placeholder="Semua Predikat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Predikat</SelectItem>
              <SelectItem value="A">Predikat A</SelectItem>
              <SelectItem value="B">Predikat B</SelectItem>
              <SelectItem value="C">Predikat C</SelectItem>
              <SelectItem value="D">Predikat D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button id="btn-tambah-nilai" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Input Nilai
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Santri</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Bulan</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Akademik</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Akhlak</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kehadiran</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Rata-rata</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Predikat</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground"><BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada rekap nilai ditemukan.</td></tr>
              ) : filtered.map((n, idx) => (
                <tr key={n.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /><div><div className="font-medium">{n.santri}</div><div className="text-xs text-muted-foreground">{n.kelas}</div></div></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{new Date(n.bulan + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</div>
                  </td>
                  <td className="px-4 py-3"><ScoreBar value={n.akademik} /></td>
                  <td className="px-4 py-3"><ScoreBar value={n.akhlak} /></td>
                  <td className="px-4 py-3"><ScoreBar value={n.kehadiran} /></td>
                  <td className="px-4 py-3 font-bold">{n.rataRata}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${predikatConfig[n.predikat]}`}>{n.predikat}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button id={`menu-nilai-${n.id}`} onClick={() => setMenuOpen(menuOpen === n.id ? null : n.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                      {menuOpen === n.id && (
                        <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                          <button onClick={() => openEdit(n)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                          <button onClick={() => { setDeleteConfirm(n.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-2xl ring-1 ring-border/60 p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editTarget ? "Edit Nilai" : "Input Nilai Bulanan"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Santri <span className="text-red-500">*</span></label>
                  <input id="input-santri-nilai" type="text" placeholder="Ahmad Fauzi" value={form.santri} onChange={e => setForm({ ...form, santri: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">NIS</label>
                  <input id="input-nis-nilai" type="text" placeholder="2024001" value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kelas <span className="text-red-500">*</span></label>
                  <input id="input-kelas-nilai" type="text" placeholder="Kelas A – TI" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Bulan <span className="text-red-500">*</span></label>
                  <input id="input-bulan-nilai" type="month" value={form.bulan} onChange={e => setForm({ ...form, bulan: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Akademik (0–100)</label>
                  <input id="input-akademik-nilai" type="number" min={0} max={100} value={form.akademik} onChange={e => setForm({ ...form, akademik: Number(e.target.value) })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Akhlak (0–100)</label>
                  <input id="input-akhlak-nilai" type="number" min={0} max={100} value={form.akhlak} onChange={e => setForm({ ...form, akhlak: Number(e.target.value) })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kehadiran (0–100)</label>
                  <input id="input-kehadiran-nilai" type="number" min={0} max={100} value={form.kehadiran} onChange={e => setForm({ ...form, kehadiran: Number(e.target.value) })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm flex items-center gap-2">
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Rata-rata otomatis: </span>
                <strong>{calcAvg(form.akademik, form.akhlak, form.kehadiran)}</strong>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${predikatConfig[getPredikat(calcAvg(form.akademik, form.akhlak, form.kehadiran))]}`}>{getPredikat(calcAvg(form.akademik, form.akhlak, form.kehadiran))}</span>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Catatan</label>
                <input id="input-catatan-nilai" type="text" placeholder="Catatan opsional..." value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-nilai" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Simpan"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Rekap Nilai</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus rekap nilai ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-nilai" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
