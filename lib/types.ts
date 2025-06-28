export interface Producto {
  id_producto: number
  codigo:      string
  nombre:      string
  descripcion: string
  precio:      number
  marca:       string
  categoria: { id_categoria: number; nombre: string }
  imagen?:     string
  stock:       number
}

export interface Usuario {
    id_usuario: number
    nombre:     string
    email:      string
    contraseña: string
    rol: { id_rol: number; nombre: string }
    direccion:  string
    telefono:   string   
}

export interface Rol{
    id_rol: number
    nombre: string
}

export interface Carrito {
    id_carrito: number
    id_usuario: number
    estado: string
}

export interface CarritoDetalle {
    id_carrito_detalle: number
    id_carrito: number
    id_producto: number
    cantidad: number
}

export interface Inventario {
    id_inventario: number
    id_sucursal: number
    id_producto: number
    stock: number
}

export interface Sucursal {
    id_sucursal: number
    nombre: string
    direccion: string
    region: string
}

export interface Categoria {
    id_categoria: number
    nombre: string
}

export interface Pedido {
    id_pedido: number
    id_cliente: number
    id_vendedor: number
    id_sucursal: number
    fecha_pedido: string
    estado: string
    metodo_pago: string
    retiro: string
}
export interface PedidoDetalle {
    id_pedido_detalle: number
    id_pedido: number
    id_producto: number
    cantidad: number
    precio_unitario: number
}

export interface Pago {
    id_pago: number
    id_pedido: number
    fecha_pago: string
    monto: number
    metodo_pago: string
    confirmado_por_contador: boolean
}