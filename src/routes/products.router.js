import { Router } from "express";
//managers
import ProductManager from "../managers/ProductManager.js";

const router = Router();
async function emitUpdaterProducts(request) {
  const updatedProducts = await ProductManager.getAll();
  request.app.get("io").emit("update-products", updatedProducts);
}

//GET
router.get("/", async (request, response) => {
  const products = await ProductManager.getAll();
  response.json(products);
});

//GET ID
router.get("/:pid", async (request, response) => {
  const pid = parseInt(request.params.pid);
  const auxProduct = await ProductManager.getById(pid);
  if (!auxProduct) {
    return response.status(400).json({
      error: "producto no encontrado",
      id: pid,
    });
  }
  response.json(auxProduct);
});

//POST
router.post("/", async (request, response) => {
  const products = await ProductManager.getAll();
  const { id = products.length + 1, title, description, code, price, prodStatus = true, stock, category } = request.body;
  console.log(id, title, description, code, price, prodStatus, stock, category);

  const numPrice = parseInt(price);
  const numStock = parseInt(stock);

  if (!title || !description || !code || numPrice == null || numStock == null || !category) {
    return response.status(400).json({
      error: "faltan campos obligatorios: title, description, code, price, stock, category,",
    });
  }
  const newProduct = await ProductManager.add(id, title, description, code, numPrice, prodStatus, numStock, category);
  await emitUpdaterProducts(request);
  response.status(201).json(newProduct);
});

//PUT UPDATE
router.put("/:pid", async (request, response) => {
  const pid = parseInt(request.params.pid);
  const updateData = request.body;

  const auxProduct = await ProductManager.getById(pid);
  if (!auxProduct) {
    return response.status(400).json({
      error: "el producto no existe",
    });
  }
  if (isNaN(Number(updateData.price)) || isNaN(Number(updateData.stock))) {
    return response.status(400).json({ error: "price y stock deben ser números" });
  }
  const updateProduct = await ProductManager.updateById(pid, updateData);

  response.status(200).json({
    message: "producto actualizado",
    product: updateProduct,
  });
});

//DELETE
router.delete("/:pid", async (request, response) => {
  const pid = parseInt(request.params.pid);
  const deleteProduct = await ProductManager.getById(pid);
  if (!deleteProduct) {
    return response.status(400).json({ error: "producto no encontrado" });
  }
  const newProducts = await ProductManager.daleteById(pid);
  const updatedProducts = await ProductManager.getAll();
  await emitUpdaterProducts(request); //
  response.status(200).json({
    message: "producto eliminado",
    products: newProducts,
  });
});

export default router;
