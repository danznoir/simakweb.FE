import { useState } from "react"
import { toast } from "sonner"
import {
  School,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Users,
  CheckCircle2,
  XCircle,
  Layers,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Kelas {
  id: number
  nama: string
  divisi: string
  kapasitas: number
  jumlahSantri: number
  status: "aktif" | "nonaktif"
  pengajar: string
}

const initialData: Kelas[] = [
  { id: 1, nama: "Kelas A", divisi: "Teknologi Informasi", kapasitas: 30, jumlahSantri: 25, status: "aktif", pengajar: "Ust. Hasan" },
  { id: 2, nama: "Kelas B", divisi: "Teknologi Informasi", kapasitas: 30, jumlahSantri: 28, status: "aktif", pengajar: "Ust. Ridwan" },
  { id: 3, nama: "Kelas A", divisi: "Akuntansi", kapasitas: 25, jumlahSantri: 20, status: "aktif", pengajar: "Ust. Salim" },
  { id: 4, nama: "Kelas B", divisi: "Akuntansi", kapasitas: 25, jumlahSantri: 22, status: "aktif", pengajar: "Ust. Hamid" },
  { id: 5, nama: "Kelas C", divisi: "Agama", kapasitas: 35, jumlahSantri: 0, status: "nonaktif", pengajar: "-" },
]

const emptyForm: Omit<Kelas, "id" | "jumlahSantri"> = { nama: "", divisi: "", kapasitas: 30, status: "aktif", pengajar: "" }

export default function KelasPage() {
  const [data, setData] = useState<Kelas[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterDivisi, setFilterDivisi] = useState("semua")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Kelas | null>(null)
  const [form, setForm] = useState<Omit<Kelas, "id" | "jumlahSantri">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const divisiList = [...new Set(data.map(d => d.divisi))]
  const statCards = [
    { label: "Total Kelas", value: data.length, icon: School, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Aktif", value: data.filter(d => d.status === "aktif").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Total Santri", value: data.reduce((a, d) => a + d.jumlahSantri, 0), icon: Users, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
    { label: "Total Divisi", value: divisiList.length, icon: Layers, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
  ]

  const filtered = data.filter(k => {
    const matchSearch = k.nama.toLowerCase().includes(search.toLowerCase()) || k.pengajar.toLowerCase().includes(search.toLowerCase())
    const matchDivisi = filterDivisi === "semua" || k.divisi === filterDivisi
    return matchSearch && matchDivisi
  })

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (k: Kelas) => { setEditTarget(k); setForm({ nama: k.nama, divisi: k.divisi, kapasitas: k.kapasitas, status: k.status, pengajar: k.pengajar }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.nama || !form.divisi) { toast.error("Nama kelas dan divisi wajib diisi."); return }
    if (editTarget) {
      setData(prev => prev.map(k => k.id === editTarget.id ? { ...k, ...form } : k))
      toast.success("Kelas berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(k => k.id)) + 1, jumlahSantri: 0, ...form }])
      toast.success("Kelas berhasil ditambahkan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(k => k.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Kelas berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Kelas</h1>
        </div>
        <p className="text-sm text-muted-foreground">Kelola data kelas yang tersedia di setiap divisi.</p>
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
            <input id="search-kelas" type="text" placeholder="Cari nama kelas atau pengajar..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
          </div>
          <Select value={filterDivisi} onValueChange={setFilterDivisi}>
            <SelectTrigger id="filter-divisi-kelas" className="w-48">
              <SelectValue placeholder="Semua Divisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Divisi</SelectItem>
              {divisiList.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <button id="btn-tambah-kelas" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Tambah Kelas
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nama Kelas</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Divisi</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pengajar</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kapasitas</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground"><School className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada kelas ditemukan.</td></tr>
              ) : filtered.map((k, idx) => {
                const fillPct = Math.round((k.jumlahSantri / k.kapasitas) * 100)
                return (
                  <tr key={k.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{k.nama}</td>
                    <td className="px-4 py-3 text-muted-foreground">{k.divisi}</td>
                    <td className="px-4 py-3">{k.pengajar}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{k.jumlahSantri}/{k.kapasitas} santri</span>
                        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${fillPct >= 90 ? "bg-red-500" : fillPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${fillPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {k.status === "aktif"
                        ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" />Aktif</span>
                        : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"><XCircle className="h-3 w-3" />Non-Aktif</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button id={`menu-kelas-${k.id}`} onClick={() => setMenuOpen(menuOpen === k.id ? null : k.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                        {menuOpen === k.id && (
                          <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                            <button onClick={() => openEdit(k)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                            <button onClick={() => { setDeleteConfirm(k.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
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
              <h2 className="text-lg font-bold">{editTarget ? "Edit Kelas" : "Tambah Kelas"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Kelas <span className="text-red-500">*</span></label>
                  <input id="input-nama-kelas" type="text" placeholder="Kelas A" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Divisi <span className="text-red-500">*</span></label>
                  <input id="input-divisi-kelas" type="text" placeholder="Teknologi Informasi" value={form.divisi} onChange={e => setForm({ ...form, divisi: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Pengajar</label>
                  <input id="input-pengajar-kelas" type="text" placeholder="Ust. Hasan" value={form.pengajar} onChange={e => setForm({ ...form, pengajar: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kapasitas</label>
                  <input id="input-kapasitas-kelas" type="number" min={1} value={form.kapasitas} onChange={e => setForm({ ...form, kapasitas: Number(e.target.value) })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as Kelas["status"] })}>
                  <SelectTrigger id="input-status-kelas" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-kelas" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Tambah"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Kelas</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus kelas ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-kelas" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
