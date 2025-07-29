import { Router } from "express";
//managers
import ProductManager from "../managers/ProductManager.js"; //logica anterior
//models ultima entrega
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

const viewsRouter = Router();

//Ruta de Vista de todos los prodcutos usando Mongoose y Paginate
viewsRouter.get("/products", async (request, response) => {
  //Logica sin Mongoose
  // const products = await ProductModel.find().lean();
  // response.render("products", { products });

  //Logica con Paginate
  const { page = 1, limit = 20, sort, query } = request.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort === "asc" || sort === "desc" ? { price: sort } : {},
    lean: true,
  };

  const filter = query ? { category: { $regex: query, $options: "i" } } : {};

  try {
    const result = await ProductModel.paginate(filter, options);

    response.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      sort,
      query,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al obtener productos paginados`,
      error: error.message,
    });
  }
});

//Ruta de Vista de lista de productos utilizando web sockets
viewsRouter.get("/realtimeproducts", async (request, response) => {
  const products = await ProductModel.find().lean();
  response.render("realTimeProducts", { products });
});

//no es parte de la consigna pero encuentro prudente para el facil acceso a los carritos
//ya que no se maneja logica de usuario/carrito
viewsRouter.get("/carts", async (req, res) => {
  try {
    const carts = await CartModel.find().lean();
    res.render("cartList", { carts });
  } catch (error) {
    res.status(500).send(`${error.name}: Error al obtener los carritos. ${error.message}`);
  }
});

//Ruta de Vista en detalle del carrito
viewsRouter.get("/carts/:cid", async (request, response) => {
  const cid = request.params.cid;

  try {
    const auxCart = await CartModel.findById(cid).populate("products.product").lean();

    if (!auxCart) {
      return response.status(404).render("error", { message: "Carrito no encontrado" });
    }

    response.render("cartDetail", { products: auxCart.products });
  } catch (error) {
    response.status(500).send(`${error.name}: Error al obtener carrito. ${error.message}`);
  }
});

//Ruta de Vista en detalle del producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    const carts = await CartModel.find().select("_id").lean(); // Solo IDs

    if (!product) {
      return res.status(404).render("error", { message: "Producto no encontrado" });
    }

    res.render("productDetail", { product, carts });
  } catch (error) {
    res.status(500).send(`${error.name}: Error no se puede mostrar el producto. ${error.message}`);
  }
});

export default viewsRouter;
