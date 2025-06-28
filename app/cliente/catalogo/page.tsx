"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, LogOut, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { getProductos } from "@/lib/api";
import { Producto } from "@/lib/types";

export default function ClienteCatalogoPage() {
  const [user, setUser] = useState<any>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [cart, setCart] = useState<{ id_producto: number; cantidad: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currency, setCurrency] = useState<"CLP" | "USD" | "EUR">("CLP");
  const router = useRouter();

  // Carga usuario, carrito y productos (incluye currency en petición)
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(u));

    const c = localStorage.getItem("cart");
    if (c) setCart(JSON.parse(c));

    // petición con parámetro currency
    getProductos(currency)
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, [router, currency]);

  // Filtrado de búsqueda y categoría
  useEffect(() => {
    let list = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categoria.nombre === selectedCategory);
    }
    setFiltered(list);
  }, [productos, searchTerm, selectedCategory]);

  // Agregar al carrito
  const addToCart = (producto: Producto) => {
    const newCart = [...cart];
    const existing = newCart.find((i) => i.id_producto === producto.id_producto);
    if (existing) {
      existing.cantidad += 1;
    } else {
      newCart.push({ id_producto: producto.id_producto, cantidad: 1 });
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    router.push("/");
  };

  const categories = Array.from(
    new Set(productos.map((p) => p.categoria.nombre))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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
                <span>
                  Carrito ({cart.reduce((sum, i) => sum + i.cantidad, 0)})
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:text-blue-200 hover:bg-blue-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Search, Filter & Currency Selector */}
      <section className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
              <Select value={selectedCategory} onValueChange={(val: string) => setSelectedCategory(val)}>
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
              <Select value={currency} onValueChange={(val: string) => setCurrency(val as "CLP" | "USD" | "EUR")}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLP">CLP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id_producto}
              producto={p}
              currency={currency}
              onAddToCart={addToCart}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}