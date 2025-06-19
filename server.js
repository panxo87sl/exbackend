import express from "express";
const server = express(); //instancia principal
server.use(express.json()); //midleware para que el server interprete JSON
const port = "8080";

let products = [];
let carrito = [];

server.get("/api/products", (request, response) => {
  response.json(products);
});
server.post("/api/products", (request, response) => {
  const {
    id = products.length + 1,
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
  } = request.body;

  const numPrice = parseInt(price);
  const numStock = parseInt(stock);

  if (
    !title ||
    !description ||
    !code ||
    numPrice == null ||
    numStock == null ||
    !category
  ) {
    return response.status(400).json({
      error:
        "Faltan campos obligatorios: title, description, code, price, stock, category,",
    });
  }
  const newProduct = {
    id,
    title,
    description,
    code,
    price: numPrice,
    status,
    stock: numStock,
    category,
  };
  products.push(newProduct);
  response.status(201).json(newProduct);
});

server.get("/api/products/:pid", (request, response) => {
  const { pid } = request.params;
  const auxProduct = products.find((item) => item.id === parseInt(pid));
  if (!auxProduct) {
    return response.status(400).json({
      error: "producto no encontrado",
      id: pid,
    });
  }
  response.json(auxProduct);
});
server.put("/api/products/:pid", (request, response) => {
  const { pid } = request.params;
  const updateData = request.body;

  const auxIndex = products.findIndex((item) => item.id === parseInt(pid)); //devuelve -1 si no se encuentra el ID
  if (auxIndex === -1) {
    return response.status(400).json({
      error: "El producto no existe",
    });
  }
  if (
    "price" in updateData &&
    isNaN(Number(updateData.price)) &&
    "stock" in updateData &&
    isNaN(Number(updateData.stock))
  ) {
    return res.status(400).json({ error: "price y stock deben ser números" });
  }
  products[auxIndex] = {
    ...products[auxIndex],
    ...updateData,
    id: parseInt(pid), //para evitar actualizar el ID
  };

  response.status(200).json({
    message: "Producto actualizado",
    product: products[auxIndex],
  });
});
server.delete("/api/products/:pid", (request, response) => {
  const { pid } = request.params;
  const deleteIndex = products.findIndex((item) => item.id === parseInt(pid));
  if (deleteIndex === -1) {
    return response.status(400).json({ error: "Producto no encontrado" });
  }
  products.splice(deleteIndex, 1);
  response.status(200).json({
    message: "Producto eliminado",
    products: products,
  });
});

server.post("/api/carts", (request, response) => {});
server.get("/api/carts/:cid", (request, response) => {});
server.post("/api/carts/:cid/products/:pid", (request, response) => {});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
