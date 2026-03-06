import { useState } from 'react'
import './App.css'

function App() {
  // use a relative path so the Vite proxy or production server handles it
  const API_URL = '/api/products'

  const categorias = [
    'Mouses',
    'Laptops',
    'MacBooks',
    'Routers',
    'Teclados',
    'Monitores',
    'Auriculares',
    'Impresoras',
    'Otros'
  ]

  // Estados para cada sección
  const [listarMsg, setListarMsg] = useState('')
  const [idBuscar, setIdBuscar] = useState('')
  const [obtenerMsg, setObtenerMsg] = useState('')
  const [crearNombre, setCrearNombre] = useState('')
  const [crearDescripcion, setCrearDescripcion] = useState('')
  const [crearPrecio, setCrearPrecio] = useState('')
  const [crearCategoria, setCrearCategoria] = useState('')
  const [crearMsg, setCrearMsg] = useState('')
  const [actualizarId, setActualizarId] = useState('')
  const [actualizarNombre, setActualizarNombre] = useState('')
  const [actualizarDescripcion, setActualizarDescripcion] = useState('')
  const [actualizarPrecio, setActualizarPrecio] = useState('')
  const [actualizarCategoria, setActualizarCategoria] = useState('')
  const [actualizarMsg, setActualizarMsg] = useState('')
  const [eliminarId, setEliminarId] = useState('')
  const [eliminarMsg, setEliminarMsg] = useState('')
  const [resultados, setResultados] = useState(null)

  // Funciones de utilidad
  const mostrarMensaje = (setter, mensaje, tipo = 'info') => {
    setter(`${tipo}:${mensaje}`)
  }

  const mostrarResultados = (datos) => {
    setResultados(datos)
  }

  const limpiarMensajes = () => {
    setListarMsg('')
    setObtenerMsg('')
    setCrearMsg('')
    setActualizarMsg('')
    setEliminarMsg('')
  }

  // 1. LISTAR
  const listarProductos = async () => {
    try {
      mostrarMensaje(setListarMsg, 'Cargando...', 'info')
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Error al listar')
      const datos = await response.json()
      mostrarMensaje(setListarMsg, `✓ Se encontraron ${datos.length} productos`, 'success')
      mostrarResultados(datos)
    } catch (error) {
      mostrarMensaje(setListarMsg, `✗ Error: ${error.message}`, 'error')
    }
  }

  // 2. OBTENER POR ID
  const obtenerProducto = async () => {
    if (!idBuscar) {
      mostrarMensaje(setObtenerMsg, 'Por favor ingresa un ID', 'error')
      return
    }
    try {
      mostrarMensaje(setObtenerMsg, 'Buscando...', 'info')
      const response = await fetch(`${API_URL}/${idBuscar}`)
      if (response.status === 404) {
        mostrarMensaje(setObtenerMsg, 'Producto no encontrado', 'error')
        return
      }
      if (!response.ok) throw new Error('Error en la búsqueda')
      const datos = await response.json()
      mostrarMensaje(setObtenerMsg, '✓ Producto encontrado', 'success')
      mostrarResultados(datos)
    } catch (error) {
      mostrarMensaje(setObtenerMsg, `✗ Error: ${error.message}`, 'error')
    }
  }

  // 3. CREAR
  const crearProducto = async () => {
    if (!crearNombre || !crearPrecio) {
      mostrarMensaje(setCrearMsg, 'Nombre y precio son requeridos', 'error')
      return
    }
    try {
      mostrarMensaje(setCrearMsg, 'Creando...', 'info')
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: crearNombre,
          description: crearDescripcion || null,
          price: parseFloat(crearPrecio),
          category: crearCategoria || null
        })
      })
      if (!response.ok) throw new Error('Error al crear')
      const datos = await response.json()
      mostrarMensaje(setCrearMsg, '✓ Producto creado exitosamente', 'success')
      mostrarResultados(datos)
      setCrearNombre('')
      setCrearDescripcion('')
      setCrearPrecio('')
      setCrearCategoria('')
    } catch (error) {
      mostrarMensaje(setCrearMsg, `✗ Error: ${error.message}`, 'error')
    }
  }

  // 4. ACTUALIZAR
  const actualizarProducto = async () => {
    if (!actualizarId) {
      mostrarMensaje(setActualizarMsg, 'ID es requerido', 'error')
      return
    }
    if (!actualizarNombre && !actualizarDescripcion && !actualizarPrecio) {
      mostrarMensaje(setActualizarMsg, 'Ingresa al menos un campo para actualizar', 'error')
      return
    }
    const datos = {}
    if (actualizarNombre) datos.name = actualizarNombre
    if (actualizarDescripcion) datos.description = actualizarDescripcion
    if (actualizarPrecio) datos.price = parseFloat(actualizarPrecio)
    if (actualizarCategoria) datos.category = actualizarCategoria

    try {
      mostrarMensaje(setActualizarMsg, 'Actualizando...', 'info')
      const response = await fetch(`${API_URL}/${actualizarId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      if (response.status === 404) {
        mostrarMensaje(setActualizarMsg, 'Producto no encontrado', 'error')
        return
      }
      if (!response.ok) throw new Error('Error al actualizar')
      const datosActualizados = await response.json()
      mostrarMensaje(setActualizarMsg, '✓ Producto actualizado exitosamente', 'success')
      mostrarResultados(datosActualizados)
      setActualizarId('')
      setActualizarNombre('')
      setActualizarDescripcion('')
      setActualizarPrecio('')
      setActualizarCategoria('')
    } catch (error) {
      mostrarMensaje(setActualizarMsg, `✗ Error: ${error.message}`, 'error')
    }
  }

  // 5. ELIMINAR
  const eliminarProducto = async () => {
    if (!eliminarId) {
      mostrarMensaje(setEliminarMsg, 'ID es requerido', 'error')
      return
    }
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto ${eliminarId}?`)) {
      return
    }
    try {
      mostrarMensaje(setEliminarMsg, 'Eliminando...', 'info')
      const response = await fetch(`${API_URL}/${eliminarId}`, {
        method: 'DELETE'
      })
      if (response.status === 404) {
        mostrarMensaje(setEliminarMsg, 'Producto no encontrado', 'error')
        return
      }
      if (!response.ok) throw new Error('Error al eliminar')
      mostrarMensaje(setEliminarMsg, '✓ Producto eliminado exitosamente', 'success')
      setResultados(null)
      setEliminarId('')
    } catch (error) {
      mostrarMensaje(setEliminarMsg, `✗ Error: ${error.message}`, 'error')
    }
  }

  // Componente de Mensaje
  const Mensaje = ({ mensaje }) => {
    if (!mensaje) return null
    const [tipo, texto] = mensaje.split(':')
    return <div className={`message ${tipo}`}>{texto}</div>
  }

  // Componente de Resultados
  const Resultados = () => {
    if (!resultados) return <div className="empty-state">Los resultados aparecerán aquí</div>

    const items = Array.isArray(resultados) ? resultados : [resultados]

    return (
      <div className="results-container">
        {items.map((producto) => (
          <div key={producto.id} className="product-card">
            <div className="id">ID: {producto.id}</div>
            <h3>{producto.name}</h3>
            <p>{producto.description || 'Sin descripción'}</p>
            <div className="price">${parseFloat(producto.price).toFixed(2)}</div>
            <div className="category">Categoría: {producto.category || 'Sin categoría'}</div>
            <small>Creado: {new Date(producto.createdAt).toLocaleString('es-ES')}</small>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🛍️ Gestor de Productos</h1>
        <p>Gestiona tu inventario de forma fácil y rápida</p>
      </div>

      <div className="content">
        {/* LISTAR */}
        <div className="section">
          <h2>📋 Listar Productos</h2>
          <p style={{ color: '#666', fontSize: '0.95em' }}>Ver todos los productos disponibles</p>
          <div className="button-group">
            <button className="btn-primary" onClick={listarProductos}>Listar Todos</button>
          </div>
          <Mensaje mensaje={listarMsg} />
        </div>

        {/* OBTENER */}
        <div className="section">
          <h2>🔍 Obtener Producto</h2>
          <div className="form-group">
            <label htmlFor="idBuscar">ID del Producto:</label>
            <input
              type="number"
              id="idBuscar"
              placeholder="Ingresa el ID"
              min="1"
              value={idBuscar}
              onChange={(e) => setIdBuscar(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button className="btn-info" onClick={obtenerProducto}>Buscar</button>
          </div>
          <Mensaje mensaje={obtenerMsg} />
        </div>

        {/* CREAR */}
        <div className="section">
          <h2>➕ Crear Producto</h2>
          <div className="form-group">
            <label htmlFor="crearNombre">Nombre:</label>
            <input
              type="text"
              id="crearNombre"
              placeholder="Ej: Laptop"
              value={crearNombre}
              onChange={(e) => setCrearNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="crearDescripcion">Descripción:</label>
            <textarea
              id="crearDescripcion"
              placeholder="Detalles del producto"
              value={crearDescripcion}
              onChange={(e) => setCrearDescripcion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="crearPrecio">Precio ($):</label>
            <input
              type="number"
              id="crearPrecio"
              placeholder="Ej: 999.99"
              step="0.01"
              min="0"
              value={crearPrecio}
              onChange={(e) => setCrearPrecio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="crearCategoria">Categoría:</label>
            <select
              id="crearCategoria"
              value={crearCategoria}
              onChange={(e) => setCrearCategoria(e.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button className="btn-success" onClick={crearProducto}>Crear</button>
          </div>
          <Mensaje mensaje={crearMsg} />
        </div>

        {/* ACTUALIZAR */}
        <div className="section">
          <h2>✏️ Actualizar Producto</h2>
          <div className="form-group">
            <label htmlFor="actualizarId">ID del Producto:</label>
            <input
              type="number"
              id="actualizarId"
              placeholder="ID a actualizar"
              min="1"
              value={actualizarId}
              onChange={(e) => setActualizarId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="actualizarNombre">Nombre (opcional):</label>
            <input
              type="text"
              id="actualizarNombre"
              placeholder="Nuevo nombre"
              value={actualizarNombre}
              onChange={(e) => setActualizarNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="actualizarDescripcion">Descripción (opcional):</label>
            <textarea
              id="actualizarDescripcion"
              placeholder="Nueva descripción"
              value={actualizarDescripcion}
              onChange={(e) => setActualizarDescripcion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="actualizarPrecio">Precio (opcional):</label>
            <input
              type="number"
              id="actualizarPrecio"
              placeholder="Nuevo precio"
              step="0.01"
              min="0"
              value={actualizarPrecio}
              onChange={(e) => setActualizarPrecio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="actualizarCategoria">Categoría (opcional):</label>
            <select
              id="actualizarCategoria"
              value={actualizarCategoria}
              onChange={(e) => setActualizarCategoria(e.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="button-group">
            <button className="btn-warning" onClick={actualizarProducto}>Actualizar</button>
          </div>
          <Mensaje mensaje={actualizarMsg} />
        </div>

        {/* ELIMINAR */}
        <div className="section">
          <h2>🗑️ Eliminar Producto</h2>
          <div className="form-group">
            <label htmlFor="eliminarId">ID del Producto:</label>
            <input
              type="number"
              id="eliminarId"
              placeholder="ID a eliminar"
              min="1"
              value={eliminarId}
              onChange={(e) => setEliminarId(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button className="btn-danger" onClick={eliminarProducto}>Eliminar</button>
          </div>
          <Mensaje mensaje={eliminarMsg} />
        </div>

        {/* RESULTADOS */}
        <div className="section results-section">
          <h2>📊 Resultados</h2>
          <Resultados />
        </div>
      </div>
    </div>
  )
}

export default App
