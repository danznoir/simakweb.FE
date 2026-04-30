import { useState } from "react"
import { toast } from "sonner"
import {
  UserCog,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Wali {
  id: number
  nama: string
  hubungan: "ayah" | "ibu" | "wali"
  telepon: string
  email: string
  pekerjaan: string
  alamat: string
  jumlahSantri: number
}

const initialData: Wali[] = [
  { id: 1, nama: "Bapak Hendra Gunawan", hubungan: "ayah", telepon: "08211000001", email: "hendra@email.com", pekerjaan: "Wirausaha", alamat: "Jl. Merdeka No. 1, Jakarta", jumlahSantri: 2 },
  { id: 2, nama: "Ibu Sari Dewi", hubungan: "ibu", telepon: "08211000002", email: "sari@email.com", pekerjaan: "PNS", alamat: "Jl. Sudirman No. 5, Bandung", jumlahSantri: 1 },
  { id: 3, nama: "Bapak Zainal Abidin", hubungan: "wali", telepon: "08211000003", email: "zainal@email.com", pekerjaan: "Guru", alamat: "Jl. Pahlawan No. 10, Surabaya", jumlahSantri: 3 },
  { id: 4, nama: "Ibu Fatimah Azzahra", hubungan: "ibu", telepon: "08211000004", email: "fatimah@email.com", pekerjaan: "Dokter", alamat: "Jl. Diponegoro No. 7, Yogyakarta", jumlahSantri: 1 },
]

const hubunganConfig = {
  ayah: { label: "Ayah", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  ibu: { label: "Ibu", className: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
  wali: { label: "Wali", className: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
}

const emptyForm: Omit<Wali, "id" | "jumlahSantri"> = { nama: "", hubungan: "ayah", telepon: "", email: "", pekerjaan: "", alamat: "" }

export default function WaliPage() {
  const [data, setData] = useState<Wali[]>(initialData)
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Wali | null>(null)
  const [form, setForm] = useState<Omit<Wali, "id" | "jumlahSantri">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    { label: "Total Wali", value: data.length, icon: UserCog, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40" },
    { label: "Ayah", value: data.filter(d => d.hubungan === "ayah").length, icon: UserCheck, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
    { label: "Ibu", value: data.filter(d => d.hubungan === "ibu").length, icon: UserCheck, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950/40" },
    { label: "Total Santri Terdaftar", value: data.reduce((a, d) => a + d.jumlahSantri, 0), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  ]

  const filtered = data.filter(w =>
    w.nama.toLowerCase().includes(search.toLowerCase()) || w.telepon.includes(search) || w.email.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (w: Wali) => { setEditTarget(w); setForm({ nama: w.nama, hubungan: w.hubungan, telepon: w.telepon, email: w.email, pekerjaan: w.pekerjaan, alamat: w.alamat }); setMenuOpen(null); setModalOpen(true) }

  const handleSave = () => {
    if (!form.nama || !form.telepon) { toast.error("Nama dan nomor telepon wajib diisi."); return }
    if (editTarget) {
      setData(prev => prev.map(w => w.id === editTarget.id ? { ...w, ...form } : w))
      toast.success("Data wali berhasil diperbarui.")
    } else {
      setData(prev => [...prev, { id: Math.max(0, ...data.map(w => w.id)) + 1, jumlahSantri: 0, ...form }])
      toast.success("Wali berhasil ditambahkan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => { setData(prev => prev.filter(w => w.id !== id)); setDeleteConfirm(null); setMenuOpen(null); toast.success("Data wali berhasil dihapus.") }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Wali Santri</h1>
        </div>
        <p className="text-sm text-muted-foreground">Kelola data wali atau orang tua santri yang terdaftar.</p>
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
          <input id="search-wali" type="text" placeholder="Cari nama, telepon, atau email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
        </div>
        <button id="btn-tambah-wali" onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95">
          <Plus className="h-4 w-4" /> Tambah Wali
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Nama Wali</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Hubungan</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Kontak</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Pekerjaan</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Santri</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground"><UserCog className="mx-auto mb-2 h-8 w-8 opacity-30" />Tidak ada wali ditemukan.</td></tr>
              ) : filtered.map((w, idx) => {
                const cfg = hubunganConfig[w.hubungan]
                return (
                  <tr key={w.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{w.nama}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{w.alamat}</div>
                    </td>
                    <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" />{w.telepon}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{w.email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{w.pekerjaan}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"><Users className="h-3 w-3" />{w.jumlahSantri} santri</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button id={`menu-wali-${w.id}`} onClick={() => setMenuOpen(menuOpen === w.id ? null : w.id)} className="rounded-md p-1.5 transition hover:bg-muted"><MoreHorizontal className="h-4 w-4" /></button>
                        {menuOpen === w.id && (
                          <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                            <button onClick={() => openEdit(w)} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                            <button onClick={() => { setDeleteConfirm(w.id); setMenuOpen(null) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" />Hapus</button>
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
              <h2 className="text-lg font-bold">{editTarget ? "Edit Wali" : "Tambah Wali Santri"}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 transition hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input id="input-nama-wali" type="text" placeholder="Bapak/Ibu ..." value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Hubungan</label>
                  <Select value={form.hubungan} onValueChange={v => setForm({ ...form, hubungan: v as Wali["hubungan"] })}>
                    <SelectTrigger id="input-hubungan-wali" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ayah">Ayah</SelectItem>
                      <SelectItem value="ibu">Ibu</SelectItem>
                      <SelectItem value="wali">Wali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Telepon <span className="text-red-500">*</span></label>
                  <input id="input-telepon-wali" type="text" placeholder="0821xxxxxxx" value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                  <input id="input-email-wali" type="email" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Pekerjaan</label>
                  <input id="input-pekerjaan-wali" type="text" placeholder="Wirausaha" value={form.pekerjaan} onChange={e => setForm({ ...form, pekerjaan: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Alamat</label>
                <textarea id="input-alamat-wali" rows={2} placeholder="Jl. ..." value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-simpan-wali" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">{editTarget ? "Simpan Perubahan" : "Tambah"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40"><Trash2 className="h-5 w-5 text-red-500" /></div>
              <div><h3 className="font-semibold">Hapus Wali</h3><p className="text-xs text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p></div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">Apakah kamu yakin ingin menghapus data wali ini?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted">Batal</button>
              <button id="btn-konfirm-hapus-wali" onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}
    </div>
  )
}
