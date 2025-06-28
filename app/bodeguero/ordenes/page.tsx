"use client"

import { useState, useEffect } from "react"
import { Package, CheckCircle, Clock, LogOut, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// Datos simulados de órdenes de bodega
const ordenes = [
  {
    id: 1,
    pedidoId: 3,
    cliente: "Carlos Silva",
    fecha: "2024-01-13",
    estado: "pendiente", // pendiente, en_preparacion, listo
    productos: [{ nombre: "Sierra Circular 7 1/4", cantidad: 1, ubicacion: "Pasillo A-3" }],
    entrega: "despacho",
    prioridad: "alta",
  },
  {
    id: 2,
    pedidoId: 2,
    cliente: "María González",
    fecha: "2024-01-14",
    estado: "en_preparacion",
    productos: [
      { nombre: "Cemento Portland 25kg", cantidad: 2, ubicacion: "Bodega B-1" },
      { nombre: "Martillo Carpintero 16oz", cantidad: 1, ubicacion: "Pasillo C-2" },
    ],
    entrega: "retiro",
    prioridad: "media",
  },
  {
    id: 3,
    pedidoId: 4,
    cliente: "Ana Torres",
    fecha: "2024-01-15",
    estado: "listo",
    productos: [{ nombre: "Pintura Látex Blanco 4L", cantidad: 3, ubicacion: "Pasillo D-1" }],
    entrega: "despacho",
    prioridad: "baja",
  },
]

export default function BodegueroOrdenesPage() {
  const [user, setUser] = useState<any>(null)
  const [ordenesList, setOrdenesList] = useState(ordenes)
  const [selectedOrden, setSelectedOrden] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "bodeguero") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "en_preparacion":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            En Preparación
          </Badge>
        )
      case "listo":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Listo
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return <Badge variant="destructive">Alta</Badge>
      case "media":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Media
          </Badge>
        )
      case "baja":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Baja
          </Badge>
        )
      default:
        return <Badge variant="secondary">{prioridad}</Badge>
    }
  }

  const iniciarPreparacion = (id: number) => {
    setOrdenesList((prev) => prev.map((orden) => (orden.id === id ? { ...orden, estado: "en_preparacion" } : orden)))
  }

  const marcarListo = (id: number) => {
    setOrdenesList((prev) => prev.map((orden) => (orden.id === id ? { ...orden, estado: "listo" } : orden)))
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
                <h1 className="text-2xl font-bold">Portal del Bodeguero</h1>
                <p className="text-blue-200 text-sm">Preparación de Pedidos</p>
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
                  <p className="text-sm font-medium text-gray-600">Órdenes Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {ordenesList.filter((o) => o.estado === "pendiente").length}
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
                  <p className="text-sm font-medium text-gray-600">En Preparación</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {ordenesList.filter((o) => o.estado === "en_preparacion").length}
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
                  <p className="text-sm font-medium text-gray-600">Listos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {ordenesList.filter((o) => o.estado === "listo").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
                  <p className="text-3xl font-bold text-gray-900">{ordenesList.length}</p>
                </div>
                <Truck className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Órdenes */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Preparación</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden ID</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenesList.map((orden) => (
                  <TableRow key={orden.id}>
                    <TableCell className="font-medium">#{orden.id}</TableCell>
                    <TableCell>#{orden.pedidoId}</TableCell>
                    <TableCell>{orden.cliente}</TableCell>
                    <TableCell>{orden.fecha}</TableCell>
                    <TableCell>{getEstadoBadge(orden.estado)}</TableCell>
                    <TableCell>{getPrioridadBadge(orden.prioridad)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{orden.entrega === "despacho" ? "Despacho" : "Retiro"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrden(orden)}>
                              Ver Detalle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalle de la Orden #{selectedOrden?.id}</DialogTitle>
                            </DialogHeader>
                            {selectedOrden && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Cliente</h4>
                                    <p>{selectedOrden.cliente}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Pedido</h4>
                                    <p>#{selectedOrden.pedidoId}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Productos a Preparar</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead>Ubicación</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrden.productos.map((producto: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>{producto.nombre}</TableCell>
                                          <TableCell>{producto.cantidad}</TableCell>
                                          <TableCell>
                                            <Badge variant="outline">{producto.ubicacion}</Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                  {selectedOrden.estado === "pendiente" && (
                                    <Button
                                      onClick={() => iniciarPreparacion(selectedOrden.id)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Package className="h-4 w-4 mr-2" />
                                      Iniciar Preparación
                                    </Button>
                                  )}
                                  {selectedOrden.estado === "en_preparacion" && (
                                    <Button
                                      onClick={() => marcarListo(selectedOrden.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Marcar como Listo
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {orden.estado === "pendiente" && (
                          <Button
                            size="sm"
                            onClick={() => iniciarPreparacion(orden.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                        )}

                        {orden.estado === "en_preparacion" && (
                          <Button
                            size="sm"
                            onClick={() => marcarListo(orden.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
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
