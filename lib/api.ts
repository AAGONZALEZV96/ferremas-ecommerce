// lib/api.ts
import { Producto } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Obtiene todos los productos, opcionalmente convertidos a otra moneda.
 * @param currency  'CLP' | 'USD' | 'EUR' (por defecto 'CLP')
 */
export async function getProductos(currency: string = "CLP"): Promise<Producto[]> {
  // Construimos la URL añadiendo ?currency= solo si no es CLP
  const url =
    currency && currency !== "CLP"
      ? `${BASE_URL}/productos?currency=${currency}`
      : `${BASE_URL}/productos`;

  const res = await fetch(url);
  return handleResponse<Producto[]>(res);
}

export async function getProductoById(
  id: number,
  currency: string = "CLP"
): Promise<Producto> {
  const url =
    currency && currency !== "CLP"
      ? `${BASE_URL}/productos/${id}?currency=${currency}`
      : `${BASE_URL}/productos/${id}`;

  const res = await fetch(url);
  return handleResponse<Producto>(res);
}

export async function createProducto(data: Partial<Producto>): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Producto>(res);
}

export async function updateProducto(
  id: number,
  data: Partial<Producto>
): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Producto>(res);
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
}
