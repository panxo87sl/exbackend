Francisco Orellana - Backend 1 - Entrega Final - Coder House

Rutas de vistas

1. /realtimeproducts
   📌 Muestra la lista de productos en tiempo real usando WebSockets.
   🔹 Renderiza la vista realTimeProducts.handlebars.
   🔹 No tiene ninguna otra logica realTimeProducts.handlebars.

2. /products
   📌 Muestra la lista paginada de productos.
   🔹 Soporta filtros por categoría (query), orden (sort), y límites (limit).
   🔹 Renderiza la vista products.handlebars con datos de paginación.

3. /carts
   📌 Muestra la lista de carritos existentes.
   🔹 Útil para acceder rápidamente a carritos sin lógica de usuarios.
   🔹 Renderiza cartList.handlebars.

4. /carts/:cid
   📌 Muestra el detalle de un carrito específico.
   🔹 Usa populate para incluir información completa de los productos.
   🔹 Renderiza cartDetail.handlebars.

5. /products/:pid
   📌 Muestra el detalle de un producto específico.
   🔹 Incluye un selector de carritos para poder agregar el producto directamente.
   🔹 Renderiza productDetail.handlebars.

💡 Nota:
Todas las rutas trabajan con datos obtenidos desde MongoDB usando Mongoose.
Las vistas usan Handlebars para mostrar la información de forma dinámica.
