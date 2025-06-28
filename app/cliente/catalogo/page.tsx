"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, LogOut, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Datos simulados de productos
const productos = [
  {
    id: 1,
    nombre: "Taladro Percutor 800W",
    precio: 89990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Herramientas Eléctricas",
    stock: 15,
    descripcion: "Taladro percutor profesional con mandril de 13mm",
  },
  {
    id: 2,
    nombre: "Cemento Portland 25kg",
    precio: 4990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Construcción",
    stock: 50,
    descripcion: "Cemento de alta calidad para construcción",
  },
  {
    id: 3,
    nombre: "Martillo Carpintero 16oz",
    precio: 12990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Herramientas Manuales",
    stock: 25,
    descripcion: "Martillo con mango de fibra de vidrio",
  },
  {
    id: 4,
    nombre: "Pintura Látex Blanco 4L",
    precio: 18990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Pinturas",
    stock: 30,
    descripcion: "Pintura látex lavable para interiores",
  },
  {
    id: 5,
    nombre: "Tornillos Autorroscantes x100",
    precio: 3990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Ferretería",
    stock: 100,
    descripcion: "Tornillos autorroscantes 6x1 pulgadas",
  },
  {
    id: 6,
    nombre: "Sierra Circular 7 1/4",
    precio: 159990,
    imagen: "/placeholder.svg?height=200&width=200",
    categoria: "Herramientas Eléctricas",
    stock: 8,
    descripcion: "Sierra circular profesional 1800W",
  },
]

export default function ClienteCatalogoPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState(productos)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [router])

  useEffect(() => {
    let filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedCategory !== "all") {
      filtered = filtered.filter((producto) => producto.categoria === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory])

  const addToCart = (producto: any) => {
    const newCart = [...cart]
    const existing = newCart.find((item) => item.id === producto.id)

    if (existing) {
      existing.cantidad += 1
    } else {
      newCart.push({ ...producto, cantidad: 1 })
    }

    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price)
  }

  const categories = [...new Set(productos.map((p) => p.categoria))]

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
              <h1 className="text-2xl font-bold">FERREMAS</h1>
              <span className="text-blue-200 text-sm hidden md:block">Portal del Cliente</span>
            </div>

            <nav className="flex items-center space-x-6">
              <span className="text-blue-200">Hola, {user.name}</span>
              <Link
                href="/cliente/carrito"
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Carrito ({cart.reduce((sum, item) => sum + item.cantidad, 0)})</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("user")
                  localStorage.removeItem("cart")
                  router.push("/")
                }}
                className="text-white hover:text-blue-200 hover:bg-blue-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((producto) => (
              <Card key={producto.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={producto.imagen || "/placeholder.svg"}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {producto.categoria}
                  </Badge>
                  <CardTitle className="text-lg mb-2">{producto.nombre}</CardTitle>
                  <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-900">{formatPrice(producto.precio)}</span>
                    <span className="text-sm text-gray-500">Stock: {producto.stock}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => addToCart(producto)}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    disabled={producto.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
