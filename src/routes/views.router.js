import { Router } from "express";
//managers
import ProductManager from "../managers/ProductManager.js";

const viewsRouter = Router();

viewsRouter.get("/products", async (request, response) => {
  const products = await ProductManager.getAll();
  response.render("products", { products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await ProductManager.getAll();
  res.render("realTimeProducts", { products });
});

export default viewsRouter;
