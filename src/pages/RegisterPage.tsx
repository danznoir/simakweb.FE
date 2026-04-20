import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AuthAPI } from "@/services/api"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.")
      return
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.")
      return
    }

    setLoading(true)
    try {
      await AuthAPI.register({ name, email, password })
      navigate("/login", { replace: true, state: { registered: true } })
    } catch (err: unknown) {
      const apiError = err as { message?: string }
      setError(apiError?.message ?? "Registrasi gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          error={error}
          loading={loading}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

interface RegisterFormProps extends React.ComponentProps<"div"> {
  name: string
  email: string
  password: string
  confirmPassword: string
  error: string
  loading: boolean
  onNameChange: (val: string) => void
  onEmailChange: (val: string) => void
  onPasswordChange: (val: string) => void
  onConfirmPasswordChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

function RegisterForm({
  className,
  name,
  email,
  password,
  confirmPassword,
  error,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  ...props
}: RegisterFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
                <p className="text-balance text-muted-foreground">
                  Isi data di bawah untuk mendaftar
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3">
                  <FieldError className="text-center">{error}</FieldError>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  required
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@contoh.com"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  required
                  value={confirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Mendaftar..." : "Daftar"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Masuk di sini
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-gradient-to-br from-slate-800 to-slate-950 md:flex md:flex-col md:items-center md:justify-center md:p-10">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] h-[60%] w-[60%] rounded-full bg-emerald-600/20 blur-[80px]" />
              <div className="absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-blue-600/20 blur-[80px]" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M13.5 19.5l-2.25-2.25M13.5 19.5l2.25-2.25m-2.25 2.25V12m0 7.5a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Bergabung Sekarang
              </h2>
              <p className="max-w-xs text-sm text-slate-400">
                Daftarkan diri Anda dan mulai kelola kegiatan pesantren dengan mudah dan efisien.
              </p>
              <ul className="mt-2 flex flex-col gap-2 text-left">
                {["Manajemen Santri", "Absensi Digital", "Tugas & Penilaian", "Laporan Real-time"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="h-4 w-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Dengan mendaftar, Anda menyetujui{" "}
        <a href="#" className="underline underline-offset-4">
          Syarat Layanan
        </a>{" "}
        dan{" "}
        <a href="#" className="underline underline-offset-4">
          Kebijakan Privasi
        </a>
        .
      </FieldDescription>
    </div>
  )
}
