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

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await AuthAPI.login({ email, password })
      if (res?.token) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user ?? {}))
      }
      navigate("/dashboard", { replace: true })
    } catch (err: unknown) {
      const apiError = err as { message?: string }
      setError(apiError?.message ?? "Login gagal. Periksa email dan password Anda.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          email={email}
          password={password}
          error={error}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string
  password: string
  error: string
  loading: boolean
  onEmailChange: (val: string) => void
  onPasswordChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

function LoginForm({
  className,
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang</h1>
                <p className="text-balance text-muted-foreground">
                  Masuk ke akun Anda untuk melanjutkan
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3">
                  <FieldError className="text-center">{error}</FieldError>
                </div>
              )}

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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Lupa password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  disabled={loading}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Masuk..." : "Masuk"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Daftar sekarang
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-gradient-to-br from-slate-800 to-slate-950 md:flex md:flex-col md:items-center md:justify-center md:p-10">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] h-[60%] w-[60%] rounded-full bg-blue-600/20 blur-[80px]" />
              <div className="absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-purple-600/20 blur-[80px]" />
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
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Sistem Manajemen Pesantren
              </h2>
              <p className="max-w-xs text-sm text-slate-400">
                Platform terpadu untuk manajemen santri, kelas, absensi, dan tugas secara digital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Dengan masuk, Anda menyetujui{" "}
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
