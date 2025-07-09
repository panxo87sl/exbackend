import { Router } from "express";
//managers
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

//PROCEDIMIENTOS DE CARRO

//GET ID
router.get("/:cid", async (request, response) => {
  const cid = parseInt(request.params.cid);
  const auxCart = await CartManager.getById(cid);

  if (!auxCart) {
    return response.status(400).json({ error: "carrito no existe" });
  }
  response.status(200).json(auxCart);
});

//POST
router.post("/", async (request, response) => {
  const newCart = await CartManager.add();
  response.status(201).json({ message: "carrito creado correctamente", cart: newCart });
});

//POST Product to Cart
router.post("/:cid/products/:pid", async (request, response) => {
  const cid = parseInt(request.params.cid);
  const pid = parseInt(request.params.pid);

  // if (carts.length < 1) {
  //   return response.status(400).json({ error: "no hay carros disponibles" });
  // }

  const cart = await CartManager.getById(cid);
  if (!cart) {
    return response.status(400).json({ error: "carrito no existe", idCarrito: cid });
  }

  const productChoice = await ProductManager.getById(pid);
  if (!productChoice) {
    return response.status(400).json({ error: "producto no existe", idProducto: pid });
  }

  const updateCart = await CartManager.addProductToCart(cid, pid);
  response.status(200).json({
    message: "producto agregado al carrito",
    product: updateCart,
  });
});

export default router;
