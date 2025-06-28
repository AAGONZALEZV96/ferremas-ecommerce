import { Producto } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${BASE_URL}/productos/`);
  return handleResponse<Producto[]>(res);
}

export async function getProductoById(id: number): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  return handleResponse<Producto>(res);
}

export async function createProducto(data: Partial<Producto>): Promise<Producto> {
  const res = await fetch(`${BASE_URL}/productos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Producto>(res);
}

// … y así para updateProducto, deleteProducto, y para Rol, Usuario, etc.
