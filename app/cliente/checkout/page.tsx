"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Datos de entrega
    deliveryMethod: "delivery", // delivery o pickup
    address: "",
    city: "",
    phone: "",
    notes: "",

    // Datos de pago
    paymentMethod: "credit", // credit, debit, transfer
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cartData = JSON.parse(savedCart)
      if (cartData.length === 0) {
        router.push("/cliente/carrito")
        return
      }
      setCart(cartData)
    } else {
      router.push("/cliente/carrito")
    }
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const shipping = formData.deliveryMethod === "pickup" ? 0 : subtotal > 50000 ? 0 : 5990
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulación de procesamiento del pedido
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Limpiar carrito
      localStorage.removeItem("cart")
      setOrderComplete(true)
    } catch (error) {
      console.error("Error al procesar el pedido:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
            <p className="text-gray-600 mb-4">
              Tu pedido ha sido recibido y está siendo procesado. Recibirás una confirmación por email.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/cliente/catalogo")} className="w-full">
                Seguir Comprando
              </Button>
              <Button variant="outline" onClick={() => router.push("/cliente/pedidos")} className="w-full">
                Ver Mis Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/cliente/carrito" className="flex items-center space-x-2 hover:text-blue-200">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Carrito</span>
            </Link>
            <h1 className="text-2xl font-bold">Finalizar Compra</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Método de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Método de Entrega</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, deliveryMethod: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">
                        Despacho a domicilio ({shipping > 0 ? formatPrice(shipping) : "Gratis"})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Retiro en tienda (Gratis)</Label>
                    </div>
                  </RadioGroup>

                  {formData.deliveryMethod === "delivery" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                          placeholder="Calle, número, comuna"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                          placeholder="Santiago"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label htmlFor="phone">Teléfono de Contacto</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+56 9 1234 5678"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Método de Pago */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Método de Pago</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">Tarjeta de Crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit">Tarjeta de Débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer">Transferencia Bancaria</Label>
                    </div>
                  </RadioGroup>

                  {(formData.paymentMethod === "credit" || formData.paymentMethod === "debit") && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cardName: e.target.value }))}
                          placeholder="Juan Pérez"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cardExpiry: e.target.value }))}
                            placeholder="MM/AA"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            value={formData.cardCvv}
                            onChange={(e) => setFormData((prev) => ({ ...prev, cardCvv: e.target.value }))}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "transfer" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Datos para transferencia:</strong>
                        <br />
                        Banco: Banco Estado
                        <br />
                        Cuenta Corriente: 12345678
                        <br />
                        RUT: 12.345.678-9
                        <br />
                        Nombre: FERREMAS LTDA
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-3" disabled={loading}>
                {loading ? "Procesando..." : `Confirmar Pedido - ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.nombre} x{item.cantidad}
                    </span>
                    <span>{formatPrice(item.precio * item.cantidad)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-900">{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
