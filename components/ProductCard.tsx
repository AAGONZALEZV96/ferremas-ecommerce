import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Producto } from '@/lib/types';

interface ProductCardProps {
  producto: Producto;
  currency: string;                      // Código de la moneda, ej. 'CLP', 'USD', 'EUR'
  onAddToCart: (producto: Producto) => void;
}

export function ProductCard({ producto, currency, onAddToCart }: ProductCardProps) {
  const {
    nombre,
    descripcion,
    precio,
    imagen,
    categoria,
    stock,
  } = producto;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="p-0">
        <img
          src={imagen || '/placeholder.svg'}
          alt={nombre}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Badge variant="secondary" className="mb-2">
          {categoria.nombre}
        </Badge>
        <CardTitle className="text-lg mb-2 truncate">
          {nombre}
        </CardTitle>
        <p className="text-gray-600 text-sm flex-1 mb-4">
          {descripcion}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-900">
            {formatPrice(precio)}
          </span>
          <span className="text-sm text-gray-500">Stock: {stock}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(producto)}
          className="w-full bg-blue-900 hover:bg-blue-800"
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
}