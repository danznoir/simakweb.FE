import { useState } from "react"
import { toast } from "sonner"
import {
  BookOpenCheck,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Calendar,
  User,
  Smile,
  Meh,
  Frown,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Jurnal {
  id: number
  santri: string
  nis: string
  kelas: string
  tanggal: string
  kegiatan: string
  kondisi: "baik" | "cukup" | "kurang"
  catatan: string
}

const today = new Date().toISOString().split("T")[0]

const initialData: Jurnal[] = [
  { id: 1, santri: "Ahmad Fauzi", nis: "2024001", kelas: "Kelas A – TI", tanggal: today, kegiatan: "Belajar React hooks bersama pembimbing.", kondisi: "baik", catatan: "Aktif dan semangat belajar." },
  { id: 2, santri: "Siti Aisyah", nis: "2024002", kelas: "Kelas B – AK", tanggal: today, kegiatan: "Mengerjakan laporan keuangan bulanan.", kondisi: "cukup", catatan: "Butuh bimbingan lebih pada akrual." },
  { id: 3, santri: "Budi Santoso", nis: "2024003", kelas: "Kelas A – TI", tanggal: today, kegiatan: "Izin sakit, tidak mengikuti kegiatan.", kondisi: "kurang", catatan: "Perlu dipantau kondisinya." },
  { id: 4, santri: "Nur Halimah", nis: "2024004", kelas: "Kelas C – AG", tanggal: today, kegiatan: "Tahfidz Al-Qur'an dan diskusi fiqih.", kondisi: "baik", catatan: "Hafalan meningkat pesat." },
]

const kondisiConfig = {
  baik: { label: "Baik", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: <Smile className="h-3.5 w-3.5" /> },
  cukup: { label: "Cukup", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", icon: <Meh className="h-3.5 w-3.5" /> },
  kurang: { label: "Kurang", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: <Frown className="h-3.5 w-3.5" /> },
}

const emptyForm: Omit<Jurnal, "id"> = { santri: "", nis: "", kelas: "", tanggal: today, kegiatan: "", kondisi: "baik", catatan: "" }

export default function JurnalPage() {
  const [data, setData] = useState<Jurnal[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterKondisi, setFilterKondisi] = useState("semua")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Jurnal | null>(null)
  const [form, setForm] = useState<Omit<Jurnal, "id">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    { label: "Total Jurnal", value: data.length, icon: BookOpenCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Kondisi Baik", value: data.filter(d => d.kondisi === "baik").length, icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Kondisi Cukup", value: data.filter(d => d.kondisi === "cukup").length, icon: Meh, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Kondisi Kurang", value: data.filter(d => d.kondisi === "kurang").length, icon: Frown, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
  ]

  const filtered = data.filter(j => {
    const matchSearch = j.santri.toLowerCase().includes(search.toLowerCase()) || j.kelas.toLowerCase().includes(search.toLowerCase()) || j.kegiatan.toLowerCase().includes(search.toLowerCase())
    const matchKondisi = filterKondisi === "semua" || j.kondisi === filterKondisi
    return matchSearch && matchKondisi
  })

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (j: Jurnal) => { setEditTarget(j); setForm({ santri: j.santri, nis: j.nis, kelas: j.kelas, tanggal: j.tanggal, kegiatan: j.kegiatan, kondisi: j.kondisi, catatan: j.catatan }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.santri || !form.kelas || !form.tanggal || !form.kegiatan) { toast.error("Harap lengkapi semua field wajib."); return }
    if (editTarget) {
      setData(prev => prev.map(j => j.id === editTarget.id ? { ...j, ...form } : j))
      toast.success("Jurnal berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(j => j.id)) + 1, ...form }])
      toast.success("Jurnal berhasil dicatat.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(j => j.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Jurnal berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Jurnal Harian</h1>
        </div>
        <p className="text-sm text-muted-foreground">Catat dan pantau perkembangan harian santri.</p>
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
            <input id="search-jurnal" type="text" placeholder="Cari santri, kelas, kegiatan..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
          </div>
          <Select value={filterKondisi} onValueChange={setFilterKondisi}>
            <SelectTrigger id="filter-kondisi-jurnal" className="w-40">
              <SelectValue placeholder="Semua Kondisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kondisi</SelectItem>
              <SelectItem value="baik">Baik</SelectItem>
              <SelectItem value="cukup">Cukup</SelectItem>
              <SelectItem value="kurang">Kurang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button id="btn-catat-jurnal" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Catat Jurnal
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Santri</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Tanggal</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kegiatan</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kondisi</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Catatan</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground"><BookOpen className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada jurnal ditemukan.</td></tr>
              ) : filtered.map((j, idx) => {
                const cfg = kondisiConfig[j.kondisi]
                return (
                  <tr key={j.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /><div><div className="font-medium">{j.santri}</div><div className="text-xs text-muted-foreground">{j.kelas}</div></div></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{new Date(j.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]"><p className="line-clamp-2 text-sm">{j.kegiatan}</p></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.className}`}>{cfg.icon}{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[150px]"><p className="line-clamp-2 text-xs">{j.catatan || "—"}</p></td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button id={`menu-jurnal-${j.id}`} onClick={() => setMenuOpen(menuOpen === j.id ? null : j.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                        {menuOpen === j.id && (
                          <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                            <button onClick={() => openEdit(j)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                            <button onClick={() => { setDeleteConfirm(j.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-2xl bg-background shadow-2xl ring-1 ring-border/60 p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editTarget ? "Edit Jurnal" : "Catat Jurnal Harian"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Santri <span className="text-red-500">*</span></label>
                  <input id="input-santri-jurnal" type="text" placeholder="Ahmad Fauzi" value={form.santri} onChange={e => setForm({ ...form, santri: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">NIS</label>
                  <input id="input-nis-jurnal" type="text" placeholder="2024001" value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kelas <span className="text-red-500">*</span></label>
                  <input id="input-kelas-jurnal" type="text" placeholder="Kelas A – TI" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Tanggal <span className="text-red-500">*</span></label>
                  <input id="input-tanggal-jurnal" type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kegiatan Hari Ini <span className="text-red-500">*</span></label>
                <textarea id="input-kegiatan-jurnal" rows={2} placeholder="Deskripsikan kegiatan santri..." value={form.kegiatan} onChange={e => setForm({ ...form, kegiatan: e.target.value })} className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kondisi</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["baik", "cukup", "kurang"] as const).map(k => (
                    <button key={k} onClick={() => setForm({ ...form, kondisi: k })} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${form.kondisi === k ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{kondisiConfig[k].icon}{kondisiConfig[k].label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Catatan Tambahan</label>
                <input id="input-catatan-jurnal" type="text" placeholder="Catatan opsional..." value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-jurnal" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Catat"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Jurnal</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus jurnal ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-jurnal" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
