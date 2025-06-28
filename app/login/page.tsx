"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulación de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulación de diferentes roles basado en el email
      let role = "cliente"
      if (formData.email.includes("admin")) role = "admin"
      else if (formData.email.includes("vendedor")) role = "vendedor"
      else if (formData.email.includes("bodeguero")) role = "bodeguero"
      else if (formData.email.includes("contador")) role = "contador"

      // Guardar datos de sesión (en una app real usarías JWT o similar)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          role: role,
          name: formData.email.split("@")[0],
        }),
      )

      // Redireccionar según el rol
      router.push("/dashboard")
    } catch (err) {
      setError("Credenciales inválidas. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de FERREMAS</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email o Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Regístrate aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Credenciales de Prueba</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>
              <strong>Cliente:</strong> cliente@test.com
            </p>
            <p>
              <strong>Administrador:</strong> admin@test.com
            </p>
            <p>
              <strong>Vendedor:</strong> vendedor@test.com
            </p>
            <p>
              <strong>Bodeguero:</strong> bodeguero@test.com
            </p>
            <p>
              <strong>Contador:</strong> contador@test.com
            </p>
            <p className="text-gray-500 mt-2">Contraseña: cualquier texto</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
