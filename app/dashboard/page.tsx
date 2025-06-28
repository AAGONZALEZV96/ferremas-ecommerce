"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Users, ClipboardList, CreditCard, Settings } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Redireccionar según el rol
    setTimeout(() => {
      switch (parsedUser.role) {
        case "cliente":
          router.push("/cliente/catalogo")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
        case "vendedor":
          router.push("/vendedor/pedidos")
          break
        case "bodeguero":
          router.push("/bodeguero/ordenes")
          break
        case "contador":
          router.push("/contador/pagos")
          break
        default:
          router.push("/")
      }
    }, 2000)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "cliente":
        return <ShoppingCart className="h-8 w-8" />
      case "admin":
        return <Settings className="h-8 w-8" />
      case "vendedor":
        return <ClipboardList className="h-8 w-8" />
      case "bodeguero":
        return <Package className="h-8 w-8" />
      case "contador":
        return <CreditCard className="h-8 w-8" />
      default:
        return <Users className="h-8 w-8" />
    }
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case "cliente":
        return "Portal del Cliente"
      case "admin":
        return "Panel de Administración"
      case "vendedor":
        return "Portal del Vendedor"
      case "bodeguero":
        return "Portal del Bodeguero"
      case "contador":
        return "Portal del Contador"
      default:
        return "Dashboard"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "cliente":
        return "Explora nuestro catálogo y realiza tus compras"
      case "admin":
        return "Gestiona usuarios, productos y configuraciones del sistema"
      case "vendedor":
        return "Gestiona pedidos y coordina despachos"
      case "bodeguero":
        return "Prepara pedidos y gestiona inventario"
      case "contador":
        return "Confirma pagos y registra entregas"
      default:
        return "Bienvenido al sistema"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center text-white">
            {getRoleIcon(user.role)}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">¡Bienvenido, {user.name}!</CardTitle>
          <p className="text-gray-600 mt-2">{getRoleTitle(user.role)}</p>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">{getRoleDescription(user.role)}</p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">Serás redirigido automáticamente en unos segundos...</p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => {
                localStorage.removeItem("user")
                router.push("/")
              }}
              variant="outline"
              className="flex-1"
            >
              Cerrar Sesión
            </Button>
            <Button
              onClick={() => {
                switch (user.role) {
                  case "cliente":
                    router.push("/cliente/catalogo")
                    break
                  case "admin":
                    router.push("/admin/dashboard")
                    break
                  case "vendedor":
                    router.push("/vendedor/pedidos")
                    break
                  case "bodeguero":
                    router.push("/bodeguero/ordenes")
                    break
                  case "contador":
                    router.push("/contador/pagos")
                    break
                  default:
                    router.push("/")
                }
              }}
              className="flex-1 bg-blue-900 hover:bg-blue-800"
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
