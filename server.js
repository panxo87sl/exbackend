import express from "express";
import ProductManager from "./managers/ProductManager.js";
const server = express(); //instancia principal
server.use(express.json()); //midleware para que el server interprete JSON
const port = "8080";

let carts = [];

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

server.get("/api/carts/:cid", (request, response) => {
  const { cid } = request.params;
  const auxCart = carts.find((item) => item.id === parseInt(cid));

  if (!auxCart) {
    return response.status(400).json({ error: "carrito no existe" });
  }
  response.status(200).json(auxCart);
});
server.post("/api/carts", (request, response) => {
  const newCart = { id: carts.length + 1, products: [] };
  carts.push(newCart);
  response
    .status(201)
    .json({ message: "carrito creado correctamente", cart: carts });
});
server.post("/api/carts/:cid/products/:pid", (request, response) => {
  const cid = parseInt(request.params.cid);
  const pid = parseInt(request.params.pid);

  if (carts.length < 1) {
    return response.status(400).json({ error: "no hay carros disponibles" });
  }
  const cart = carts.find((item) => item.id === cid);
  if (!cart) {
    return response
      .status(400)
      .json({ error: "carrito no existe", idCarrito: cid });
  }

  const productChoice = products.find((item) => item.id === pid);
  if (!productChoice) {
    return response
      .status(400)
      .json({ error: "producto no existe", idProducto: pid });
  }

  const listProductsOnCart = cart.products; //lista de productos en el carro
  const indexProductOnCart = listProductsOnCart.findIndex(
    (item) => item.id === pid
  ); //me devuelve el indice donde esta el objeto en el carro

  if (indexProductOnCart === -1) {
    const newProductToCart = { id: pid, quantity: 1 }; //si no existe se crea el objeto
    listProductsOnCart.push(newProductToCart);
  } else {
    listProductsOnCart[indexProductOnCart].quantity++; //si existe se aumenta su cantidad
  }
  response.status(200).json({
    message: "producto agregado al carrito",
    product: listProductsOnCart,
  });
});

server.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
