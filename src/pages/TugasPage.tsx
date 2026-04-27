import { useState } from "react"
import { toast } from "sonner"
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Tugas {
  id: number
  judul: string
  pelajaran: string
  kelas: string
  tenggat: string
  status: "aktif" | "selesai" | "terlambat"
  deskripsi: string
}

const initialData: Tugas[] = [
  {
    id: 1,
    judul: "React Fundamentals",
    pelajaran: "Pemrograman Web",
    kelas: "Kelas A",
    tenggat: "2026-05-10",
    status: "aktif",
    deskripsi: "Buat komponen React sederhana menggunakan hooks.",
  },
  {
    id: 2,
    judul: "ERD Database Pesantren",
    pelajaran: "Basis Data",
    kelas: "Kelas B",
    tenggat: "2026-04-25",
    status: "selesai",
    deskripsi: "Rancang ERD untuk sistem manajemen pesantren.",
  },
  {
    id: 3,
    judul: "Laporan Keuangan Bulanan",
    pelajaran: "Akuntansi Dasar",
    kelas: "Kelas C",
    tenggat: "2026-04-20",
    status: "terlambat",
    deskripsi: "Susun laporan keuangan bulan April.",
  },
  {
    id: 4,
    judul: "Desain Jaringan LAN",
    pelajaran: "Jaringan Komputer",
    kelas: "Kelas A",
    tenggat: "2026-05-15",
    status: "aktif",
    deskripsi: "Rancang topologi jaringan LAN untuk kantor kecil.",
  },
  {
    id: 5,
    judul: "Essay Fiqih Muamalah",
    pelajaran: "Fiqih",
    kelas: "Kelas B",
    tenggat: "2026-05-05",
    status: "aktif",
    deskripsi: "Tulis essay 1000 kata tentang hukum jual beli dalam Islam.",
  },
]

const statusConfig = {
  aktif: {
    label: "Aktif",
    className:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    icon: <Clock className="h-3 w-3" />,
  },
  selesai: {
    label: "Selesai",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  terlambat: {
    label: "Terlambat",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    icon: <AlertCircle className="h-3 w-3" />,
  },
}

const emptyForm: Omit<Tugas, "id"> = {
  judul: "",
  pelajaran: "",
  kelas: "",
  tenggat: "",
  status: "aktif",
  deskripsi: "",
}

export default function TugasPage() {
  const [data, setData] = useState<Tugas[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("semua")
  const [menuOpen, setMenuOpen] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Tugas | null>(null)
  const [form, setForm] = useState<Omit<Tugas, "id">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const statCards = [
    {
      label: "Total Tugas",
      value: data.length,
      icon: ClipboardList,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      label: "Aktif",
      value: data.filter((d) => d.status === "aktif").length,
      icon: Clock,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      label: "Selesai",
      value: data.filter((d) => d.status === "selesai").length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Terlambat",
      value: data.filter((d) => d.status === "terlambat").length,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/40",
    },
  ]

  const filtered = data.filter((t) => {
    const matchSearch =
      t.judul.toLowerCase().includes(search.toLowerCase()) ||
      t.pelajaran.toLowerCase().includes(search.toLowerCase()) ||
      t.kelas.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      filterStatus === "semua" || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const openCreate = () => {
    setEditTarget(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (tugas: Tugas) => {
    setEditTarget(tugas)
    setForm({
      judul: tugas.judul,
      pelajaran: tugas.pelajaran,
      kelas: tugas.kelas,
      tenggat: tugas.tenggat,
      status: tugas.status,
      deskripsi: tugas.deskripsi,
    })
    setMenuOpen(null)
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.judul || !form.pelajaran || !form.kelas || !form.tenggat) {
      toast.error("Harap lengkapi semua field wajib.")
      return
    }
    if (editTarget) {
      setData((prev) =>
        prev.map((t) => (t.id === editTarget.id ? { ...t, ...form } : t))
      )
      toast.success("Tugas berhasil diperbarui.")
    } else {
      const newId = Math.max(0, ...data.map((t) => t.id)) + 1
      setData((prev) => [...prev, { id: newId, ...form }])
      toast.success("Tugas berhasil ditambahkan.")
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((t) => t.id !== id))
    setDeleteConfirm(null)
    setMenuOpen(null)
    toast.success("Tugas berhasil dihapus.")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Tugas</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Kelola seluruh tugas yang diberikan kepada santri di setiap kelas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="border-0 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="search-tugas"
              type="text"
              placeholder="Cari tugas, pelajaran, kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative flex items-center gap-1 rounded-lg border bg-background px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              id="filter-status-tugas"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm outline-none cursor-pointer"
            >
              <option value="semua">Semua</option>
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="terlambat">Terlambat</option>
            </select>
          </div>
        </div>
        <button
          id="btn-tambah-tugas"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Tambah Tugas
        </button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Judul Tugas
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Pelajaran
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Kelas
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Tenggat
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <FileText className="mx-auto mb-2 h-8 w-8 opacity-30" />
                    Tidak ada tugas ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((tugas, idx) => {
                  const cfg = statusConfig[tugas.status]
                  return (
                    <tr
                      key={tugas.id}
                      className="border-b last:border-0 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{tugas.judul}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {tugas.deskripsi}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          {tugas.pelajaran}
                        </div>
                      </td>
                      <td className="px-4 py-3">{tugas.kelas}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(tugas.tenggat).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block">
                          <button
                            id={`menu-tugas-${tugas.id}`}
                            onClick={() =>
                              setMenuOpen(
                                menuOpen === tugas.id ? null : tugas.id
                              )
                            }
                            className="rounded-md p-1.5 transition hover:bg-muted"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {menuOpen === tugas.id && (
                            <div className="absolute right-0 top-8 z-20 min-w-[130px] rounded-lg border bg-popover shadow-lg">
                              <button
                                onClick={() => openEdit(tugas)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirm(tugas.id)
                                  setMenuOpen(null)
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-background shadow-2xl ring-1 ring-border/60 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editTarget ? "Edit Tugas" : "Tambah Tugas"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1.5 transition hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Judul Tugas <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-judul-tugas"
                  type="text"
                  placeholder="Contoh: React Fundamentals"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-pelajaran-tugas"
                    type="text"
                    placeholder="Contoh: Pemrograman Web"
                    value={form.pelajaran}
                    onChange={(e) =>
                      setForm({ ...form, pelajaran: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-kelas-tugas"
                    type="text"
                    placeholder="Contoh: Kelas A"
                    value={form.kelas}
                    onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Tenggat <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-tenggat-tugas"
                    type="date"
                    value={form.tenggat}
                    onChange={(e) =>
                      setForm({ ...form, tenggat: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <select
                    id="input-status-tugas"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as Tugas["status"],
                      })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="terlambat">Terlambat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Deskripsi
                </label>
                <textarea
                  id="input-deskripsi-tugas"
                  rows={3}
                  placeholder="Deskripsi singkat tugas..."
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted"
              >
                Batal
              </button>
              <button
                id="btn-simpan-tugas"
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                {editTarget ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl ring-1 ring-border/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Hapus Tugas</h3>
                <p className="text-xs text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Apakah kamu yakin ingin menghapus tugas ini?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border px-4 py-2 text-sm transition hover:bg-muted"
              >
                Batal
              </button>
              <button
                id="btn-konfirm-hapus-tugas"
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {menuOpen !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpen(null)}
        />
      )}
    </div>
  )
}
