import { Router } from "express";
//managers
import ProductManager from "../managers/ProductManager.js"; //logica anterior
//models ultima entrega
import ProductModel from "../models/product.model.js";

const viewsRouter = Router();

viewsRouter.get("/products", async (request, response) => {
  const products = await ProductModel.find().lean();
  response.render("products", { products });
});

viewsRouter.get("/realtimeproducts", async (request, response) => {
  const products = await ProductModel.find().lean();
  response.render("realTimeProducts", { products });
});

export default viewsRouter;
