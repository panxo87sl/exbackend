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
  if (
    !title ||
    !description ||
    !code ||
    price == null ||
    stock == null ||
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
    price,
    status,
    stock,
    category,
  };
  products.push(newProduct);
  response.status(201).json(newProduct);
});

server.get("/api/products/:pid", (request, response) => {
  const { pid } = request.params;
  const aux = products.find((p) => p.id === parseInt(pid));
  if (!aux) {
    return response.status(400).json({
      error: "producto no encontrado",
      id: pid,
    });
  }
  response.json(aux);
});
server.put("/api/products/:pid", (request, response) => {});
server.delete("/api/products/:pid", (request, response) => {});

server.post("/api/carts", (request, response) => {});
server.get("/api/carts/:cid", (request, response) => {});
server.post("/api/carts/:cid/products/:pid", (request, response) => {});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
