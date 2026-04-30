import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  UserCheck,
  UserX,
  GraduationCap,
  Phone,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Santri {
  id: number
  nama: string
  nis: string
  kelas: string
  divisi: string
  status: "aktif" | "nonaktif" | "lulus"
  telepon: string
  alamat: string
}

const initialData: Santri[] = [
  { id: 1, nama: "Ahmad Fauzi", nis: "2024001", kelas: "Kelas A", divisi: "Teknologi Informasi", status: "aktif", telepon: "08111000001", alamat: "Jl. Merdeka No. 1" },
  { id: 2, nama: "Siti Aisyah", nis: "2024002", kelas: "Kelas B", divisi: "Akuntansi", status: "aktif", telepon: "08111000002", alamat: "Jl. Sudirman No. 5" },
  { id: 3, nama: "Budi Santoso", nis: "2024003", kelas: "Kelas A", divisi: "Teknologi Informasi", status: "nonaktif", telepon: "08111000003", alamat: "Jl. Pahlawan No. 10" },
  { id: 4, nama: "Nur Halimah", nis: "2024004", kelas: "Kelas C", divisi: "Agama", status: "aktif", telepon: "08111000004", alamat: "Jl. Diponegoro No. 7" },
  { id: 5, nama: "Rizki Ramadhan", nis: "2023010", kelas: "Kelas B", divisi: "Akuntansi", status: "lulus", telepon: "08111000005", alamat: "Jl. Gajah Mada No. 3" },
]

const statusConfig = {
  aktif: { label: "Aktif", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: <UserCheck className="h-3 w-3" /> },
  nonaktif: { label: "Non-Aktif", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", icon: <UserX className="h-3 w-3" /> },
  lulus: { label: "Lulus", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300", icon: <GraduationCap className="h-3 w-3" /> },
}

const emptyForm: Omit<Santri, "id"> = { nama: "", nis: "", kelas: "", divisi: "", status: "aktif", telepon: "", alamat: "" }

export default function SantriPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Santri[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("semua")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Santri | null>(null)
  const [form, setForm] = useState<Omit<Santri, "id">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    { label: "Total Santri", value: data.length, icon: Users, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Aktif", value: data.filter(d => d.status === "aktif").length, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Non-Aktif", value: data.filter(d => d.status === "nonaktif").length, icon: UserX, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
    { label: "Lulus", value: data.filter(d => d.status === "lulus").length, icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
  ]

  const filtered = data.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search) || s.kelas.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "semua" || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (s: Santri) => { setEditTarget(s); setForm({ nama: s.nama, nis: s.nis, kelas: s.kelas, divisi: s.divisi, status: s.status, telepon: s.telepon, alamat: s.alamat }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.nama || !form.nis || !form.kelas || !form.divisi) { toast.error("Harap lengkapi semua field wajib."); return }
    if (editTarget) {
      setData(prev => prev.map(s => s.id === editTarget.id ? { ...s, ...form } : s))
      toast.success("Data santri berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(s => s.id)) + 1, ...form }])
      toast.success("Santri berhasil ditambahkan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(s => s.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Santri berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Data Santri</h1>
        </div>
        <p className="text-sm text-muted-foreground">Kelola seluruh data santri yang terdaftar di pesantren.</p>
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
            <input id="search-santri" type="text" placeholder="Cari nama, NIS, kelas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="filter-status-santri" className="w-36">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Non-Aktif</SelectItem>
              <SelectItem value="lulus">Lulus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button id="btn-tambah-santri" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Tambah Santri
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">NIS</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kelas</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Divisi</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Telepon</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Wali</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground"><Users className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada santri ditemukan.</td></tr>
              ) : filtered.map((s, idx) => {
                const cfg = statusConfig[s.status]
                return (
                  <tr
                    key={s.id}
                    className="group border-b last:border-0 cursor-pointer transition-colors hover:bg-primary/5"
                    onClick={() => navigate(`/dashboard/santri/${s.id}/wali-profile`)}
                  >
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.nama}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.nis}</td>
                    <td className="px-4 py-3">{s.kelas}</td>
                    <td className="px-4 py-3">{s.divisi}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{s.telepon}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.icon}{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                        <UserCheck className="h-3.5 w-3.5" />
                        Lihat Profil Wali
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <button id={`menu-santri-${s.id}`} onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                            <button onClick={() => openEdit(s)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                            <button onClick={() => { setDeleteConfirm(s.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
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
              <h2 className="text-lg font-bold">{editTarget ? "Edit Santri" : "Tambah Santri"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input id="input-nama-santri" type="text" placeholder="Ahmad Fauzi" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">NIS <span className="text-red-500">*</span></label>
                  <input id="input-nis-santri" type="text" placeholder="2024001" value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kelas <span className="text-red-500">*</span></label>
                  <input id="input-kelas-santri" type="text" placeholder="Kelas A" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Divisi <span className="text-red-500">*</span></label>
                  <input id="input-divisi-santri" type="text" placeholder="Teknologi Informasi" value={form.divisi} onChange={e => setForm({ ...form, divisi: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Telepon</label>
                  <input id="input-telepon-santri" type="text" placeholder="0811xxxxxxx" value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as Santri["status"] })}>
                    <SelectTrigger id="input-status-santri" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                      <SelectItem value="lulus">Lulus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Alamat</label>
                <textarea id="input-alamat-santri" rows={2} placeholder="Jl. Merdeka No. 1..." value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-santri" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Tambah"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Santri</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus data santri ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-santri" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
