import { Router } from "express";
//managers logica anterior JSON y Managers
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";
//models
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

const router = Router();

//PROCEDIMIENTOS DE CARRO
//GET
router.get("/", async (request, response) => {
  try {
    const carts = await CartModel.find();
    response.status(200).json({
      status: "success",
      payload: carts,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al obtener los carritos`,
      error: error.message,
    });
  }
});

//GET ID
router.get("/:cid", async (request, response) => {
  //Logica anterior JSON y Managers
  // const cid = parseInt(request.params.cid);
  // const auxCart = await CartManager.getById(cid);
  // response.status(200).json(auxCart);

  try {
    const cid = request.params.cid;
    const auxCart = await CartModel.findById(cid).populate("products.product");

    if (!auxCart) {
      return response.status(404).json({
        error: "carrito no existe",
      });
    }

    response.status(200).json({
      status: "success",
      payload: auxCart,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al obtener carrito`,
      error: error.message,
    });
  }
});

//POST
router.post("/", async (request, response) => {
  //Logica anterior JSON + Managers
  // const newCart = await CartManager.add();
  // response.status(201).json({ message: "carrito creado correctamente", cart: newCart });

  try {
    const newCart = await CartModel.create({ products: [] });

    response.status(201).json({
      message: "carrito creado correctamente",
      payload: newCart,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al crear carrito`,
      error: error.message,
    });
  }
});

//POST Product to Cart
router.post("/:cid/products/:pid", async (request, response) => {
  //Logica anterior JSON + Managers
  // const cid = parseInt(request.params.cid);
  // const pid = parseInt(request.params.pid);
  // const cart = await CartManager.getById(cid);
  // if (!cart) {
  //   return response.status(400).json({ error: "carrito no existe", idCarrito: cid });
  // }
  // const productChoice = await ProductManager.getById(pid);
  // if (!productChoice) {
  //   return response.status(400).json({ error: "producto no existe", idProducto: pid });
  // }
  // const updateCart = await CartManager.addProductToCart(cid, pid);
  // response.status(200).json({
  //   message: "producto agregado al carrito",
  //   product: updateCart,
  // });

  const cid = request.params.cid;
  const pid = request.params.pid;
  try {
    // Obtengo y valido existencia del carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return response.status(400).json({
        status: "error",
        message: "carrito no existe",
        details: { idCarrito: cid },
        error: error.message,
      });
    }

    // Obventog y Valido existencia del producto
    const product = await ProductModel.findById(pid);
    if (!product) {
      return response.status(400).json({
        status: "error",
        message: "producto no existe",
        details: { idProducto: pid },
        error: error.message,
      });
    }

    // Busco si el producto ya está en el carrito
    const existingProduct = cart.products.find((aux) => aux.product.equals(pid));

    if (existingProduct) {
      // Si ya existe, aumentar cantidad
      existingProduct.quantity += 1;
    } else {
      // Si no existe, agregarlo
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    }

    // Guardar cambios en cart y estan en memoria
    await cart.save();

    response.status(200).json({
      message: "producto agregado al carrito",
      payload: cart,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Error combinacion Carro/Prodcuto invalida`,
        details: { idCarro: cid, idProducto: pid },
        error: error.message,
      });
    }
    response.status(500).json({
      message: `${error.name}: Error al agregar producto al carrito`,
      error: error.message,
    });
  }
});

//DELETE Vaciar Carrito
router.delete("/:cid", async (request, response) => {
  const cid = request.params.cid;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "carrito no encontrado", idCarrito: cid });
    }

    cart.products = []; // vaciamos el carrito
    await cart.save(); // guardamos el cambio

    response.status(200).json({
      message: "carrito vaciado correctamente",
      payload: cart,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Error al vaciar el carrito",
      error: error.message,
    });
  }
});

//DELETE Borrar producto de un carro
router.delete("/:cid/products/:pid", async (request, response) => {
  const cid = request.params.cid;
  const pid = request.params.pid;

  try {
    // Obtengo y valido existencia del carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return response.status(400).json({
        status: "error",
        message: "carrito no existe",
        details: { idCarrito: cid },
      });
    }

    // obtengo y valido existencia del producto
    const product = await ProductModel.findById(pid);
    if (!product) {
      return response.status(400).json({
        status: "error",
        message: "producto no existe",
        details: { idProducto: pid },
      });
    }

    // Filtro los productos dejando fuera el que se quiere eliminar
    const initialLength = cart.products.length;
    cart.products = cart.products.filter((aux) => !aux.product.equals(pid));

    // Si no cambió nada, es que el producto no estaba en el carrito
    if (cart.products.length === initialLength) {
      return response.status(404).json({
        status: "error",
        message: "producto no encontrado en carrito",
        details: { idProducto: pid },
      });
    }

    await cart.save();

    response.status(200).json({
      message: "producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Error combinacion Carro/Prodcuto invalida`,
        details: { idCarro: cid, idProducto: pid },
        error: error.message,
      });
    }
    response.status(500).json({
      message: `${error.name}: Error al eliminar producto del carrito`,
      error: error.message,
    });
  }
});

//PUT actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (request, response) => {
  const cid = request.params.cid;
  const pid = request.params.pid;
  const { quantity } = request.body;

  try {
    // Validación básica del body
    if (typeof quantity !== "number" || quantity < 1) {
      return response.status(400).json({
        status: "error",
        message: "La cantidad debe ser un número entero mayor a 0",
      });
    }

    // Buscar el carrito
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return response.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
        details: { idCarrito: cid },
      });
    }

    // Buscar el producto en el carrito
    const productInCart = cart.products.find((aux) => aux.product.equals(pid));
    if (!productInCart) {
      return response.status(404).json({
        status: "error",
        message: "Producto no encontrado en carrito",
        details: { idProducto: pid },
      });
    }

    // Actualizar la cantidad
    productInCart.quantity = quantity;
    await cart.save();

    response.status(200).json({
      status: "success",
      message: "Cantidad actualizada correctamente",
      payload: { cart: cart },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Error combinacion Carro/Prodcuto invalida`,
        details: { idCarro: cid, idProducto: pid },
        error: error.message,
      });
    }

    response.status(500).json({
      status: "error",
      message: "Error al actualizar cantidad del producto",
      error: error.message,
    });
  }
});

export default router;
