"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, LogOut, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoria: string;
  stock: number;
  descripcion: string;
}

export default function ClienteCatalogoPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const router = useRouter();

  // 1. Carga usuario y carrito
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [router]);

  // 2. Fetch productos desde la API
  useEffect(() => {
    fetch("/api/productos/")
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando productos");
        return res.json();
      })
      .then((data: Producto[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
      });
  }, []);

  // 3. Filtrado cada vez que cambian products, searchTerm o selectedCategory
  useEffect(() => {
    let lista = products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== "all") {
      lista = lista.filter((p) => p.categoria === selectedCategory);
    }
    setFilteredProducts(lista);
  }, [products, searchTerm, selectedCategory]);

  // 4. Añadir al carrito
  const addToCart = (producto: Producto) => {
    const newCart = [...cart];
    const existing = newCart.find((item) => item.id_producto === producto.id_producto);
    if (existing) {
      existing.cantidad += 1;
    } else {
      newCart.push({ ...producto, cantidad: 1 });
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);

  const categories = Array.from(new Set(products.map((p) => p.categoria)));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">FERREMAS</h1>
              <span className="text-blue-200 text-sm hidden md:block">
                Portal del Cliente
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <span className="text-blue-200">Hola, {user.name}</span>
              <Link
                href="/cliente/carrito"
                className="flex items-center space-x-1 hover:text-blue-200"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Carrito ({cart.reduce((s, i) => s + i.cantidad, 0)})</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("cart");
                  router.push("/");
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

      {/* Search & Filters */}
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <Card key={p.id_producto} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={p.imagen || "/placeholder.svg"}
                    alt={p.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {p.categoria}
                  </Badge>
                  <CardTitle className="text-lg mb-2">{p.nombre}</CardTitle>
                  <p className="text-gray-600 text-sm mb-3">{p.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-900">
                      {formatPrice(p.precio)}
                    </span>
                    <span className="text-sm text-gray-500">Stock: {p.stock}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => addToCart(p)}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    disabled={p.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {p.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
