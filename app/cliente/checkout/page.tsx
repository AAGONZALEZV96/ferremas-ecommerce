"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductos } from "@/lib/api";
import { Producto } from "@/lib/types";

interface RawCartEntry {
  id_producto: number;
  cantidad: number;
}

export default function CheckoutPage() {
  const [rawCart, setRawCart] = useState<RawCartEntry[]>([]);
  const [cartItems, setCartItems] = useState<(Producto & { cantidad: number })[]>([]);
  const [user, setUser] = useState<any>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryMethod: "delivery",
    address: "",
    city: "",
    phone: "",
    notes: "",
    paymentMethod: "credit",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const router = useRouter();

  // 1) load user and rawCart
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) return router.push("/login");
    setUser(JSON.parse(u));
    const saved = localStorage.getItem("cart");
    if (!saved) return router.push("/cliente/carrito");
    const parsed: RawCartEntry[] = JSON.parse(saved);
    if (parsed.length === 0) return router.push("/cliente/carrito");
    setRawCart(parsed);
  }, [router]);

  // 2) resolve full products
  useEffect(() => {
    getProductos().then((all) => {
      const items = rawCart
        .map((e) => {
          const p = all.find((x) => x.id_producto === e.id_producto);
          return p ? { ...p, cantidad: e.cantidad } : null;
        })
        .filter(Boolean) as (Producto & { cantidad: number })[];
      setCartItems(items);
    });
  }, [rawCart]);

  // 3) persist rawCart
  const updateRawCart = (newCart: RawCartEntry[]) => {
    setRawCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) return removeItem(id);
    updateRawCart(
      rawCart.map((e) =>
        e.id_producto === id ? { ...e, cantidad: qty } : e
      )
    );
  };
  const removeItem = (id: number) =>
    updateRawCart(rawCart.filter((e) => e.id_producto !== id));

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(n);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.precio * i.cantidad,
    0
  );
  const shipping =
    formData.deliveryMethod === "pickup"
      ? 0
      : subtotal > 50000
      ? 0
      : 5990;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    localStorage.removeItem("cart");
    setOrderComplete(true);
    setLoading(false);
  };

  if (!user)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" />
      </div>
    );

  if (orderComplete)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu pedido ha sido recibido y está siendo procesado.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/cliente/catalogo")}
                className="w-full"
              >
                Seguir Comprando
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/cliente/pedidos")}
                className="w-full"
              >
                Ver Mis Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/cliente/carrito"
              className="flex items-center space-x-2 hover:text-blue-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Carrito</span>
            </Link>
            <h1 className="text-2xl font-bold">Finalizar Compra</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery */}
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
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, deliveryMethod: v }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">
                        Despacho a domicilio (
                        {shipping > 0 ? formatPrice(shipping) : "Gratis"})
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
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              address: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              city: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="notes">Notas (opt)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
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
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, paymentMethod: v }))
                    }
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
                      <Label htmlFor="transfer">
                        Transferencia Bancaria
                      </Label>
                    </div>
                  </RadioGroup>
                  {(formData.paymentMethod === "credit" ||
                    formData.paymentMethod === "debit") && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              cardNumber: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en Tarjeta</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              cardName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                cardExpiry: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            value={formData.cardCvv}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                cardCvv: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {formData.paymentMethod === "transfer" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Datos para transferencia...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-3"
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : `Confirmar Pedido - ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id_producto}
                    className="flex justify-between text-sm"
                  >
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
                    <span>
                      {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                    </span>
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
  );
}
