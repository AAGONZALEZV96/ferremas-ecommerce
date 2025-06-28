"use client"

import { useState, useEffect } from "react"
import { CreditCard, CheckCircle, Clock, LogOut, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Datos simulados de pagos y entregas
const pagos = [
  {
    id: 1,
    pedidoId: 5,
    cliente: "Roberto Martínez",
    fecha: "2024-01-15",
    monto: 45990,
    metodoPago: "transferencia",
    estado: "pendiente", // pendiente, confirmado, rechazado
    comprobante: "TRANS_001234",
    productos: ["Taladro Inalámbrico", "Brocas Set x10"],
  },
  {
    id: 2,
    pedidoId: 6,
    cliente: "Laura Fernández",
    fecha: "2024-01-14",
    monto: 89990,
    metodoPago: "transferencia",
    estado: "confirmado",
    comprobante: "TRANS_001235",
    productos: ["Sierra Caladora", "Hojas de Sierra x20"],
  },
  {
    id: 3,
    pedidoId: 7,
    cliente: "Diego Morales",
    fecha: "2024-01-13",
    monto: 125000,
    metodoPago: "transferencia",
    estado: "pendiente",
    comprobante: "TRANS_001236",
    productos: ["Compresor de Aire", "Manguera 10m"],
  },
]

const entregas = [
  {
    id: 1,
    pedidoId: 8,
    cliente: "Carmen López",
    fecha: "2024-01-15",
    direccion: "Av. Las Condes 1234",
    estado: "entregado", // pendiente, entregado
    transportista: "Juan Pérez",
    productos: ["Cemento 25kg x5", "Arena 1m³"],
  },
  {
    id: 2,
    pedidoId: 9,
    cliente: "Miguel Santos",
    fecha: "2024-01-14",
    direccion: "Retiro en tienda",
    estado: "pendiente",
    transportista: "N/A",
    productos: ["Pintura Esmalte 4L", "Rodillos x3"],
  },
]

export default function ContadorPagosPage() {
  const [user, setUser] = useState<any>(null)
  const [pagosList, setPagosList] = useState(pagos)
  const [entregasList, setEntregasList] = useState(entregas)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pagos")
  const [observaciones, setObservaciones] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "contador") {
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

  const getEstadoPagoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "confirmado":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Confirmado
          </Badge>
        )
      case "rechazado":
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getEstadoEntregaBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        )
      case "entregado":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Entregado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const confirmarPago = (id: number) => {
    setPagosList((prev) => prev.map((pago) => (pago.id === id ? { ...pago, estado: "confirmado" } : pago)))
  }

  const rechazarPago = (id: number) => {
    setPagosList((prev) => prev.map((pago) => (pago.id === id ? { ...pago, estado: "rechazado" } : pago)))
  }

  const confirmarEntrega = (id: number) => {
    setEntregasList((prev) =>
      prev.map((entrega) => (entrega.id === id ? { ...entrega, estado: "entregado" } : entrega)),
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
              <CreditCard className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Portal del Contador</h1>
                <p className="text-blue-200 text-sm">Confirmación de Pagos y Entregas</p>
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
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "pagos" ? "default" : "outline"}
            onClick={() => setActiveTab("pagos")}
            className={activeTab === "pagos" ? "bg-blue-900 hover:bg-blue-800" : ""}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Pagos por Transferencia
          </Button>
          <Button
            variant={activeTab === "entregas" ? "default" : "outline"}
            onClick={() => setActiveTab("entregas")}
            className={activeTab === "entregas" ? "bg-blue-900 hover:bg-blue-800" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            Registro de Entregas
          </Button>
        </div>

        {activeTab === "pagos" && (
          <>
            {/* Stats Cards - Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {pagosList.filter((p) => p.estado === "pendiente").length}
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
                      <p className="text-sm font-medium text-gray-600">Pagos Confirmados</p>
                      <p className="text-3xl font-bold text-green-600">
                        {pagosList.filter((p) => p.estado === "confirmado").length}
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
                      <p className="text-sm font-medium text-gray-600">Monto Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(pagosList.reduce((sum, p) => sum + p.monto, 0))}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Pagos */}
            <Card>
              <CardHeader>
                <CardTitle>Pagos por Transferencia Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Comprobante</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagosList.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell className="font-medium">#{pago.id}</TableCell>
                        <TableCell>#{pago.pedidoId}</TableCell>
                        <TableCell>{pago.cliente}</TableCell>
                        <TableCell>{pago.fecha}</TableCell>
                        <TableCell className="font-medium">{formatPrice(pago.monto)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pago.comprobante}</Badge>
                        </TableCell>
                        <TableCell>{getEstadoPagoBadge(pago.estado)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedItem(pago)}>
                                  Ver Detalle
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalle del Pago #{selectedItem?.id}</DialogTitle>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold">Cliente</h4>
                                        <p>{selectedItem.cliente}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Comprobante</h4>
                                        <p>{selectedItem.comprobante}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Productos</h4>
                                      <ul className="list-disc list-inside space-y-1">
                                        {selectedItem.productos?.map((producto: string, index: number) => (
                                          <li key={index} className="text-sm">
                                            {producto}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <Label htmlFor="observaciones">Observaciones</Label>
                                      <Textarea
                                        id="observaciones"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder="Agregar observaciones sobre el pago..."
                                      />
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                      <span className="text-lg font-bold">
                                        Monto: {formatPrice(selectedItem.monto)}
                                      </span>
                                      {selectedItem.estado === "pendiente" && (
                                        <div className="space-x-2">
                                          <Button variant="destructive" onClick={() => rechazarPago(selectedItem.id)}>
                                            Rechazar
                                          </Button>
                                          <Button
                                            onClick={() => confirmarPago(selectedItem.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            Confirmar Pago
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {pago.estado === "pendiente" && (
                              <>
                                <Button variant="destructive" size="sm" onClick={() => rechazarPago(pago.id)}>
                                  Rechazar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => confirmarPago(pago.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmar
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "entregas" && (
          <>
            {/* Stats Cards - Entregas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Entregas Pendientes</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {entregasList.filter((e) => e.estado === "pendiente").length}
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
                      <p className="text-sm font-medium text-gray-600">Entregas Completadas</p>
                      <p className="text-3xl font-bold text-green-600">
                        {entregasList.filter((e) => e.estado === "entregado").length}
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
                      <p className="text-sm font-medium text-gray-600">Total Entregas</p>
                      <p className="text-3xl font-bold text-blue-600">{entregasList.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Entregas */}
            <Card>
              <CardHeader>
                <CardTitle>Registro de Entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Transportista</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entregasList.map((entrega) => (
                      <TableRow key={entrega.id}>
                        <TableCell className="font-medium">#{entrega.id}</TableCell>
                        <TableCell>#{entrega.pedidoId}</TableCell>
                        <TableCell>{entrega.cliente}</TableCell>
                        <TableCell>{entrega.fecha}</TableCell>
                        <TableCell>{entrega.direccion}</TableCell>
                        <TableCell>{entrega.transportista}</TableCell>
                        <TableCell>{getEstadoEntregaBadge(entrega.estado)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedItem(entrega)}>
                                  Ver Detalle
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detalle de la Entrega #{selectedItem?.id}</DialogTitle>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold">Cliente</h4>
                                        <p>{selectedItem.cliente}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Dirección</h4>
                                        <p>{selectedItem.direccion}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Productos Entregados</h4>
                                      <ul className="list-disc list-inside space-y-1">
                                        {selectedItem.productos?.map((producto: string, index: number) => (
                                          <li key={index} className="text-sm">
                                            {producto}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                      {selectedItem.estado === "pendiente" && (
                                        <Button
                                          onClick={() => confirmarEntrega(selectedItem.id)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Confirmar Entrega
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {entrega.estado === "pendiente" && (
                              <Button
                                size="sm"
                                onClick={() => confirmarEntrega(entrega.id)}
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
          </>
        )}
      </div>
    </div>
  )
}
