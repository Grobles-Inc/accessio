import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

export type Producto = Database['public']['Tables']['productos']['Row']
export type ProductoInsert = Database['public']['Tables']['productos']['Insert']
export type ProductoUpdate = Database['public']['Tables']['productos']['Update']



export const getProductosByCategoria = async (categoriaId: string): Promise<Producto[]> => {
  try {
    const resultadoVerificacion = await verificarYActualizarProductosVencidos();

    if (resultadoVerificacion.error) {
      console.warn("Error en verificación de vencimiento de productos:", resultadoVerificacion.error);
    }

    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        categorias:categoria_id(nombre),
        usuarios:proveedor_id(nombres, apellidos, billetera_id, usuario)
      `)
      .eq('categoria_id', categoriaId)
      .eq('estado', 'publicado')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching productos:', error);
      return [];
    }
    return data || [];
  }
  catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
}


// Get producto by ID
export const getProductoById = async (id: string): Promise<Producto | null> => {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categorias:categoria_id(nombre),
      usuarios:proveedor_id(nombres, usuario)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching producto:', error)
    return null
  }

  return data
}


// Get all productos
export const getProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categorias:categoria_id(nombre),
      usuarios:proveedor_id(nombres)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching productos:', error)
    return []
  }

  return data || []
}

const verificarYActualizarProductosVencidos = async (): Promise<{ productosActualizados: number; error?: string}> => {
  try {
    const ahora = new Date().toISOString();

    // Buscar productos publicados que ya vencieron
    const { data: productosVencidos, error: errorBusqueda } = await supabase
      .from('productos')
      .select('id')
      .eq('estado', 'publicado')
      .not('fecha_expiracion', 'is', null)
      .lt('fecha_expiracion', ahora)
    if (errorBusqueda) {
      console.error('Error al buscar productos vencidos:' , errorBusqueda);
      return { productosActualizados:0, error: errorBusqueda.message }
    }

    if (!productosVencidos || productosVencidos.length === 0) {
      return { productosActualizados:0 }
    }

    // Actualizar estado de los productos vencidos a estado "borrador"
    const idsProductosVencidos = productosVencidos.map(p => p.id);

    const { data: productosActualizados, error: errorActualizacion } = await supabase
      .from('productos')
      .update({
        estado: 'borrador',
        updated_at: new Date().toISOString()
      })
      .in('id', idsProductosVencidos)
      .select('id, nombre')
    if (errorActualizacion) {
      console.error('Error al actualizar productos vencidos:', errorActualizacion);
      return { productosActualizados:0, error: errorActualizacion.message }
    }
    const cantidadActualizada = productosActualizados?.length || 0

    if (cantidadActualizada > 0) {
      console.log(`${cantidadActualizada} productos vencidos actualizados a estado "borrador"`);
    }
    return { productosActualizados: cantidadActualizada}
  } catch (error) {
    console.error('Error al verificar y actualizar productos vencidos:', error);
    return {
      productosActualizados: 0,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}


// Get productos with pagination
export const getProductosPaginated = async (
  page: number = 1,
  pageSize: number = 6
): Promise<{ data: Producto[]; count: number }> => {
  try {
    const resultadoVerificacion = await verificarYActualizarProductosVencidos();

    if (resultadoVerificacion.error) {
      console.warn("Error en verificación de vencimiento de productos:", resultadoVerificacion.error);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('productos')
      .select(
        `*,
          categorias:categoria_id(nombre),
          usuarios:proveedor_id(usuario)
        `, { count: 'exact' })
        .range(from, to)
        .eq('estado', 'publicado')
        .order('created_at', { ascending: false})

      if (error) {
        console.error('Error feching paginated productos:', error);
        return { data: [], count:0 }
      }
      return { data: data || [], count: count || 0 }
  } catch (error) {
    console.error('Error en getProductosPaginated:', error);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error: queryError, count } = await supabase
      .from('productos')
      .select(
        `*,
        categorias: categoria_id(nombre),
        usuarios: proveedor_id(usuario)
        `, { count: 'exact' })
      .range(from, to)
      .eq('estado', 'publicado')
      .order('created_at', { ascending: false})
    if (queryError) {
      console.error('Error feching paginated productos (fallback):', queryError);
      return { data: [], count:0 }
    }
    return { data: data || [], count: count || 0 }
  }
}