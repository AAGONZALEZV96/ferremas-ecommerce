"use client";

import { useEffect, useState } from "react";
import { getProductos } from "@/lib/api";
import { Producto } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export default function ClienteCatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (producto: Producto) => {
    // tu lógica de carrito aquí
  };

  if (loading) return <div className="p-4">Cargando productos…</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Catálogo de Productos</h1>
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
      >
        {productos.map((p) => (
          <ProductCard
            key={p.id_producto}
            producto={p}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}
