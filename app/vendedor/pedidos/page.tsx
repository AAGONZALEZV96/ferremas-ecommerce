"use client"

import { useState, useEffect } from "react"
import { Package, Eye, Check, X, LogOut, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// Datos simulados de pedidos
const pedidos = [
  {
    id: 1,
    cliente: "Juan Pérez",
    email: "juan@email.com",
    fecha: "2024-01-15",
    total: 89990,
    estado: "pendiente",
    productos: [{ nombre: "Taladro Percutor 800W", cantidad: 1, precio: 89990 }],
    entrega: "despacho",
    direccion: "Av. Providencia 1234, Santiago",
  },
  {
    id: 2,
    cliente: "María González",
    email: "maria@email.com",
    fecha: "2024-01-14",
    total: 23980,
    estado: "aprobado",
    productos: [
      { nombre: "Cemento Portland 25kg", cantidad: 2, precio: 4990 },
      { nombre: "Martillo Carpintero 16oz", cantidad: 1, precio: 12990 },
    ],
    entrega: "retiro",
    direccion: "Retiro en tienda",
  },
  {
    id: 3,
    cliente: "Carlos Silva",
    email: "carlos@email.com",
    fecha: "2024-01-13",
    total: 159990,
    estado: "en_preparacion",
    productos: [{ nombre: "Sierra Circular 7 1/4", cantidad: 1, precio: 159990 }],
    entrega: "despacho",
    direccion: "Las Condes 567, Santiago",
  },
]

export default function VendedorPedidosPage() {
  const [user, setUser] = useState<any>(null)
  const [pedidosList, setPedidosList] = useState(pedidos)
  const [selectedPedido, setSelectedPedido] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "vendedor") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "aprobado":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Aprobado
          </Badge>
        )
      case "rechazado":
        return <Badge variant="destructive">Rechazado</Badge>
      case "en_preparacion":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            En Preparación
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const aprobarPedido = (id: number) => {
    setPedidosList((prev) => prev.map((pedido) => (pedido.id === id ? { ...pedido, estado: "aprobado" } : pedido)))
  }

  const rechazarPedido = (id: number) => {
    setPedidosList((prev) => prev.map((pedido) => (pedido.id === id ? { ...pedido, estado: "rechazado" } : pedido)))
  }

  const enviarABodega = (id: number) => {
    setPedidosList((prev) =>
      prev.map((pedido) => (pedido.id === id ? { ...pedido, estado: "en_preparacion" } : pedido)),
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Portal del Vendedor</h1>
                <p className="text-blue-200 text-sm">Gestión de Pedidos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-blue-200">Hola, {user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="text-white hover:text-blue-200 hover:bg-blue-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {pedidosList.filter((p) => p.estado === "pendiente").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {pedidosList.filter((p) => p.estado === "aprobado").length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Preparación</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {pedidosList.filter((p) => p.estado === "en_preparacion").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">{pedidosList.length}</p>
                </div>
                <Truck className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosList.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">#{pedido.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pedido.cliente}</p>
                        <p className="text-sm text-gray-500">{pedido.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{pedido.fecha}</TableCell>
                    <TableCell className="font-medium">{formatPrice(pedido.total)}</TableCell>
                    <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pedido.entrega === "despacho" ? "Despacho" : "Retiro"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedPedido(pedido)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalle del Pedido #{selectedPedido?.id}</DialogTitle>
                            </DialogHeader>
                            {selectedPedido && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Cliente</h4>
                                    <p>{selectedPedido.cliente}</p>
                                    <p className="text-sm text-gray-500">{selectedPedido.email}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Entrega</h4>
                                    <p>{selectedPedido.direccion}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Productos</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Precio</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedPedido.productos.map((producto: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>{producto.nombre}</TableCell>
                                          <TableCell>{producto.cantidad}</TableCell>
                                          <TableCell>{formatPrice(producto.precio)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                  <span className="text-lg font-bold">Total: {formatPrice(selectedPedido.total)}</span>
                                  <div className="space-x-2">
                                    {selectedPedido.estado === "pendiente" && (
                                      <>
                                        <Button variant="destructive" onClick={() => rechazarPedido(selectedPedido.id)}>
                                          <X className="h-4 w-4 mr-2" />
                                          Rechazar
                                        </Button>
                                        <Button
                                          onClick={() => aprobarPedido(selectedPedido.id)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <Check className="h-4 w-4 mr-2" />
                                          Aprobar
                                        </Button>
                                      </>
                                    )}
                                    {selectedPedido.estado === "aprobado" && (
                                      <Button
                                        onClick={() => enviarABodega(selectedPedido.id)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Package className="h-4 w-4 mr-2" />
                                        Enviar a Bodega
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {pedido.estado === "pendiente" && (
                          <>
                            <Button variant="destructive" size="sm" onClick={() => rechazarPedido(pedido.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => aprobarPedido(pedido.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {pedido.estado === "aprobado" && (
                          <Button
                            size="sm"
                            onClick={() => enviarABodega(pedido.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
