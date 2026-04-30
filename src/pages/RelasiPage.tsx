import { useState } from "react"
import { toast } from "sonner"
import {
  Link2,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  X,
  User,
  UserCog,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Relasi {
  id: number
  santri: string
  nisSantri: string
  kelasSantri: string
  wali: string
  hubungan: "ayah" | "ibu" | "wali"
  teleponWali: string
  tanggalTerdaftar: string
}

const initialData: Relasi[] = [
  { id: 1, santri: "Ahmad Fauzi", nisSantri: "2024001", kelasSantri: "Kelas A – TI", wali: "Bapak Hendra Gunawan", hubungan: "ayah", teleponWali: "08211000001", tanggalTerdaftar: "2024-01-15" },
  { id: 2, santri: "Siti Aisyah", nisSantri: "2024002", kelasSantri: "Kelas B – AK", wali: "Ibu Sari Dewi", hubungan: "ibu", teleponWali: "08211000002", tanggalTerdaftar: "2024-01-20" },
  { id: 3, santri: "Budi Santoso", nisSantri: "2024003", kelasSantri: "Kelas A – TI", wali: "Bapak Zainal Abidin", hubungan: "wali", teleponWali: "08211000003", tanggalTerdaftar: "2024-02-01" },
  { id: 4, santri: "Nur Halimah", nisSantri: "2024004", kelasSantri: "Kelas C – AG", wali: "Ibu Fatimah Azzahra", hubungan: "ibu", teleponWali: "08211000004", tanggalTerdaftar: "2024-01-18" },
  { id: 5, santri: "Rizki Ramadhan", nisSantri: "2024005", kelasSantri: "Kelas B – AK", wali: "Bapak Hendra Gunawan", hubungan: "ayah", teleponWali: "08211000001", tanggalTerdaftar: "2024-01-25" },
]

const hubunganConfig = {
  ayah: { label: "Ayah", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  ibu: { label: "Ibu", className: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  wali: { label: "Wali", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
}

const emptyForm: Omit<Relasi, "id"> = { santri: "", nisSantri: "", kelasSantri: "", wali: "", hubungan: "ayah", teleponWali: "", tanggalTerdaftar: new Date().toISOString().split("T")[0] }

export default function RelasiPage() {
  const [data, setData] = useState<Relasi[]>(initialData)
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<Relasi, "id">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    { label: "Total Relasi", value: data.length, icon: Link2, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Santri Terdaftar", value: [...new Set(data.map(d => d.nisSantri))].length, icon: User, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
    { label: "Wali Terdaftar", value: [...new Set(data.map(d => d.wali))].length, icon: UserCog, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Rata-rata per Wali", value: data.length > 0 ? (data.length / [...new Set(data.map(d => d.wali))].length).toFixed(1) : 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
  ]

  const filtered = data.filter(r =>
    r.santri.toLowerCase().includes(search.toLowerCase()) || r.wali.toLowerCase().includes(search.toLowerCase()) || r.nisSantri.includes(search)
  )

  const openCreate = () => { setForm(emptyForm); setModalOpen(true) }

  const handleSave = () => {
    if (!form.santri || !form.wali || !form.kelasSantri) { toast.error("Harap lengkapi semua field wajib."); return }
    setData(prev => [...prev, { id: Math.max(0, ...data.map(r => r.id)) + 1, ...form }])
    toast.success("Relasi wali-santri berhasil ditambahkan.")
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(r => r.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Relasi berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Relasi Wali–Santri</h1>
        </div>
        <p className="text-sm text-muted-foreground">Kelola pemetaan hubungan antara wali dan santri.</p>
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
          <input id="search-relasi" type="text" placeholder="Cari santri, NIS, atau wali..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
        </div>
        <button id="btn-tambah-relasi" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Tambah Relasi
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Santri</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground"></th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Wali</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Hubungan</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Terdaftar</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground"><Link2 className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada relasi ditemukan.</td></tr>
              ) : filtered.map((r, idx) => {
                const cfg = hubunganConfig[r.hubungan]
                return (
                  <tr key={r.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40"><User className="h-4 w-4 text-sky-600" /></div>
                        <div>
                          <div className="font-medium">{r.santri}</div>
                          <div className="text-xs text-muted-foreground">{r.kelasSantri} · NIS {r.nisSantri}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-pink-500" />
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40"><UserCog className="h-4 w-4 text-violet-600" /></div>
                        <div>
                          <div className="font-medium">{r.wali}</div>
                          <div className="text-xs text-muted-foreground">{r.teleponWali}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.label}</span></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(r.tanggalTerdaftar).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button id={`menu-relasi-${r.id}`} onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                        {menuOpen === r.id && (
                          <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                            <button onClick={() => { setDeleteConfirm(r.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Putus Relasi</button>
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
              <h2 className="text-lg font-bold">Tambah Relasi Wali–Santri</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 dark:bg-sky-950/20 p-3 text-center">
                <User className="mx-auto mb-1 h-5 w-5 text-sky-500" />
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">Data Santri</p>
              </div>
              <div className="rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 dark:bg-violet-950/20 p-3 text-center">
                <UserCog className="mx-auto mb-1 h-5 w-5 text-violet-500" />
                <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">Data Wali</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Santri <span className="text-red-500">*</span></label>
                  <input id="input-santri-relasi" type="text" placeholder="Ahmad Fauzi" value={form.santri} onChange={e => setForm({ ...form, santri: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">NIS Santri</label>
                  <input id="input-nis-relasi" type="text" placeholder="2024001" value={form.nisSantri} onChange={e => setForm({ ...form, nisSantri: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Kelas Santri <span className="text-red-500">*</span></label>
                <input id="input-kelas-relasi" type="text" placeholder="Kelas A – TI" value={form.kelasSantri} onChange={e => setForm({ ...form, kelasSantri: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Wali <span className="text-red-500">*</span></label>
                  <input id="input-wali-relasi" type="text" placeholder="Bapak Hendra" value={form.wali} onChange={e => setForm({ ...form, wali: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Hubungan</label>
                  <Select value={form.hubungan} onValueChange={v => setForm({ ...form, hubungan: v as Relasi["hubungan"] })}>
                    <SelectTrigger id="input-hubungan-relasi" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ayah">Ayah</SelectItem>
                      <SelectItem value="ibu">Ibu</SelectItem>
                      <SelectItem value="wali">Wali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Telepon Wali</label>
                <input id="input-telepon-relasi" type="text" placeholder="0821xxxxxxx" value={form.teleponWali} onChange={e => setForm({ ...form, teleponWali: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-relasi" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">Simpan Relasi</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Putus Relasi</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin memutus relasi wali–santri ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-relasi" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Putus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
