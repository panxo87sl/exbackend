import express from "express";
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";
const server = express(); //instancia principal
server.use(express.json()); //midleware para que el server interprete JSON
const port = "8080";

server.get("/api/products", (request, response) => {
  response.json(ProductManager.getAll());
});
server.post("/api/products", (request, response) => {
  const {
    id = ProductManager.getAll().length + 1,
    title,
    description,
    code,
    price,
    prodStatus = true,
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
        "faltan campos obligatorios: title, description, code, price, stock, category,",
    });
  }
  const newProduct = ProductManager.add(
    id,
    title,
    description,
    code,
    numPrice,
    prodStatus,
    numStock,
    category
  );
  response.status(201).json(newProduct);
});

server.get("/api/products/:pid", (request, response) => {
  const pid = parseInt(request.params.pid);
  const auxProduct = ProductManager.getById(pid);
  if (!auxProduct) {
    return response.status(400).json({
      error: "producto no encontrado",
      id: pid,
    });
  }
  response.json(auxProduct);
});
server.put("/api/products/:pid", (request, response) => {
  const pid = parseInt(request.params.pid);
  const updateData = request.body;

  const auxIndex = ProductManager.getById(pid);
  if (!auxIndex) {
    return response.status(400).json({
      error: "el producto no existe",
    });
  }
  if (isNaN(Number(updateData.price)) || isNaN(Number(updateData.stock))) {
    return response
      .status(400)
      .json({ error: "price y stock deben ser números" });
  }
  const updateProduct = ProductManager.updateById(pid, updateData);

  response.status(200).json({
    message: "producto actualizado",
    product: updateProduct,
  });
});
server.delete("/api/products/:pid", (request, response) => {
  const pid = parseInt(request.params.pid);
  const deleteProduct = ProductManager.getById(pid);
  if (!deleteProduct) {
    return response.status(400).json({ error: "producto no encontrado" });
  }
  const newProducts = ProductManager.daleteById(pid);
  response.status(200).json({
    message: "producto eliminado",
    products: newProducts,
  });
});

//PROCEDIMIENTOS DE CARRO
server.get("/api/carts/:cid", (request, response) => {
  const cid = parseInt(request.params.cid);
  const auxCart = CartManager.getById(cid);

  if (!auxCart) {
    return response.status(400).json({ error: "carrito no existe" });
  }
  response.status(200).json(auxCart);
});
server.post("/api/carts", (request, response) => {
  const newCart = CartManager.add();
  response
    .status(201)
    .json({ message: "carrito creado correctamente", cart: newCart });
});
server.post("/api/carts/:cid/products/:pid", (request, response) => {
  const cid = parseInt(request.params.cid);
  const pid = parseInt(request.params.pid);

  // if (carts.length < 1) {
  //   return response.status(400).json({ error: "no hay carros disponibles" });
  // }

  const cart = CartManager.getById(cid);
  if (!cart) {
    return response
      .status(400)
      .json({ error: "carrito no existe", idCarrito: cid });
  }

  const productChoice = ProductManager.getById(pid);
  if (!productChoice) {
    return response
      .status(400)
      .json({ error: "producto no existe", idProducto: pid });
  }

  const updateCart = CartManager.addProductToCart(cid, pid);
  response.status(200).json({
    message: "producto agregado al carrito",
    product: updateCart,
  });
});

server.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
