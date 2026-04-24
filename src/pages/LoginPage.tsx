import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
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
import { AuthCarousel } from "@/components/AuthCarousel"

const DUMMY_USERS = [
  {
    email: "admin@pesantren.com",
    password: "admin123",
    token: "dummy-token-admin-001",
    user: { id: 1, name: "Admin Pesantren", role: "admin", email: "admin@pesantren.com" },
  },
  {
    email: "ustadz@pesantren.com",
    password: "ustadz123",
    token: "dummy-token-ustadz-002",
    user: { id: 2, name: "Ustadz Budi", role: "mentor", email: "ustadz@pesantren.com" },
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const matched = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (matched) {
      localStorage.setItem("token", matched.token)
      localStorage.setItem("user", JSON.stringify(matched.user))
      navigate(from, { replace: true })
    } else {
      setError("Email atau password salah. Gunakan kredensial dummy yang tersedia.")
    }

    setLoading(false)
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

              <div className="rounded-md border border-dashed border-amber-400/60 bg-amber-50/60 dark:bg-amber-900/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p className="font-semibold">Dummy Credentials (dev only)</p>
                <p><span className="font-medium">Admin:</span> admin@pesantren.com / admin123</p>
                <p><span className="font-medium">Ustadz:</span> ustadz@pesantren.com / ustadz123</p>
              </div>

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

          <AuthCarousel />
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
