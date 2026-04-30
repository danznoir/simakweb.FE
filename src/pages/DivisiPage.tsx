import { useState } from "react"
import { toast } from "sonner"
import {
  Layers,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  Hash,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Divisi {
  id: number
  nama: string
  kode: string
  deskripsi: string
  jumlahKelas: number
  status: "aktif" | "nonaktif"
}

const initialData: Divisi[] = [
  { id: 1, nama: "Teknologi Informasi", kode: "TI", deskripsi: "Divisi yang berfokus pada pengembangan teknologi dan pemrograman.", jumlahKelas: 3, status: "aktif" },
  { id: 2, nama: "Akuntansi", kode: "AK", deskripsi: "Divisi yang berfokus pada ilmu akuntansi dan keuangan.", jumlahKelas: 2, status: "aktif" },
  { id: 3, nama: "Agama", kode: "AG", deskripsi: "Divisi yang berfokus pada ilmu-ilmu keagamaan Islam.", jumlahKelas: 4, status: "aktif" },
  { id: 4, nama: "Bahasa Arab", kode: "BA", deskripsi: "Divisi khusus untuk penguasaan bahasa Arab fusha.", jumlahKelas: 2, status: "nonaktif" },
]

const emptyForm: Omit<Divisi, "id" | "jumlahKelas"> = { nama: "", kode: "", deskripsi: "", status: "aktif" }

export default function DivisiPage() {
  const [data, setData] = useState<Divisi[]>(initialData)
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Divisi | null>(null)
  const [form, setForm] = useState<Omit<Divisi, "id" | "jumlahKelas">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    { label: "Total Divisi", value: data.length, icon: Layers, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Aktif", value: data.filter(d => d.status === "aktif").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Non-Aktif", value: data.filter(d => d.status === "nonaktif").length, icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
    { label: "Total Kelas", value: data.reduce((a, d) => a + d.jumlahKelas, 0), icon: BookOpen, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
  ]

  const filtered = data.filter(d =>
    d.nama.toLowerCase().includes(search.toLowerCase()) || d.kode.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (d: Divisi) => { setEditTarget(d); setForm({ nama: d.nama, kode: d.kode, deskripsi: d.deskripsi, status: d.status }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.nama || !form.kode) { toast.error("Nama dan kode divisi wajib diisi."); return }
    if (editTarget) {
      setData(prev => prev.map(d => d.id === editTarget.id ? { ...d, ...form } : d))
      toast.success("Divisi berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(d => d.id)) + 1, jumlahKelas: 0, ...form }])
      toast.success("Divisi berhasil ditambahkan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(d => d.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Divisi berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Divisi</h1>
        </div>
        <p className="text-sm text-muted-foreground">Kelola divisi atau jurusan yang tersedia di pesantren.</p>
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
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input id="search-divisi" type="text" placeholder="Cari nama atau kode divisi..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
        </div>
        <button id="btn-tambah-divisi" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Tambah Divisi
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nama Divisi</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kode</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Jumlah Kelas</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground"><Layers className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada divisi ditemukan.</td></tr>
              ) : filtered.map((d, idx) => (
                <tr key={d.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{d.nama}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{d.deskripsi}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-mono font-semibold">{d.kode}</span></div>
                  </td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"><BookOpen className="h-3 w-3" />{d.jumlahKelas} Kelas</span></td>
                  <td className="px-4 py-3">
                    {d.status === "aktif"
                      ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" />Aktif</span>
                      : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"><XCircle className="h-3 w-3" />Non-Aktif</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative inline-block">
                      <button id={`menu-divisi-${d.id}`} onClick={() => setMenuOpen(menuOpen === d.id ? null : d.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                      {menuOpen === d.id && (
                        <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                          <button onClick={() => openEdit(d)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                          <button onClick={() => { setDeleteConfirm(d.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
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
              <h2 className="text-lg font-bold">{editTarget ? "Edit Divisi" : "Tambah Divisi"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Divisi <span className="text-red-500">*</span></label>
                  <input id="input-nama-divisi" type="text" placeholder="Teknologi Informasi" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kode <span className="text-red-500">*</span></label>
                  <input id="input-kode-divisi" type="text" placeholder="TI" value={form.kode} onChange={e => setForm({ ...form, kode: e.target.value.toUpperCase() })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as Divisi["status"] })}>
                  <SelectTrigger id="input-status-divisi" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Deskripsi</label>
                <textarea id="input-deskripsi-divisi" rows={3} placeholder="Deskripsi singkat divisi..." value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-divisi" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Tambah"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Divisi</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus divisi ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-divisi" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
