import { Router } from "express";
//managers
import ProductManager from "../managers/ProductManager.js";
//models
import ProductModel from "../models/product.model.js";

const router = Router();
async function emitUpdaterProducts(request) {
  const updatedProducts = await ProductModel.find();
  request.app.get("io").emit("update-products", updatedProducts);
}

//GET
router.get("/", async (request, response) => {
  //Logica Anterior JSON y ProductManager
  // const products = await ProductManager.getAll();
  // response.json(products);

  //Lógica con Mongoose
  // try {
  //   const products = await ProductModel.find();
  //   response.status(200).json({
  //     status: "success",
  //     payload: products,
  //   });
  // } catch (error) {
  //   response.status(500).json({
  //     status: "error",
  //     message: `${error.name}: Error al obtener los productos`,
  //     error: error.message,
  //   });
  // }

  //Lógica con Paginate
  const { limit = 10, page = 1, sort, query } = request.query;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true, // importante para Handlebars para acceder a valores "en limpio"
    };

    // Ordenamiento por precio si se indica
    if (sort === "asc") options.sort = { price: 1 };
    else if (sort === "desc") options.sort = { price: -1 };

    // Filtro por categoría si se indica
    const filter = query ? { category: query } : {};

    const result = await ProductModel.paginate(filter, options);

    response.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al obtener productos paginados`,
      error: error.message,
    });
  }
});

//GET ID
router.get("/:pid", async (request, response) => {
  const pid = request.params.pid;

  //Logica Anterior JSON y ProductManager
  // const auxProduct = await ProductManager.getById(pid);
  // if (!auxProduct) {
  //   return response.status(400).json({
  //     error: "producto no encontrado",
  //     id: pid,
  //   });
  // }
  // response.json(auxProduct);

  try {
    const auxProduct = await ProductModel.findById(pid);
    if (!auxProduct) {
      return response.status(404).json({
        status: "error",
        message: `Producto con ID ${pid} no encontrado`,
      });
    }
    response.status(200).json({
      status: "success",
      payload: auxProduct,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Producto con ID ${pid} invalido`,
      });
    }
    response.status(500).json({
      status: "error",
      message: `${error.name}: Error al buscar el producto ${pid}`,
      error: error.message,
    });
  }
});

//POST
router.post("/", async (request, response) => {
  //Logica Anterior JSON y ProductManager
  // const products = await ProductManager.getAll();
  // const { id = products.length + 1, title, description, code, price, prodStatus = true, stock, category } = request.body;
  // console.log(id, title, description, code, price, prodStatus, stock, category);

  // const numPrice = parseInt(price);
  // const numStock = parseInt(stock);

  // if (!title || !description || !code || numPrice == null || numStock == null || !category) {
  //   return response.status(400).json({
  //     error: "faltan campos obligatorios: title, description, code, price, stock, category,",
  //   });
  // }
  // const newProduct = await ProductManager.add(id, title, description, code, numPrice, prodStatus, numStock, category);
  // await emitUpdaterProducts(request);
  // response.status(201).json(newProduct);

  const { title, description, code, price, prodStatus = true, stock, category } = request.body;
  try {
    console.log(title, description, code, price, prodStatus, stock, category);

    const numPrice = parseInt(price);
    const numStock = parseInt(stock);

    if (!title || !description || !code || numPrice == null || numStock == null || !category) {
      return response.status(400).json({
        error: "faltan campos obligatorios: title, description, code, price, stock, category",
      });
    }

    const newProduct = await ProductModel.create({
      title,
      description,
      code,
      price: numPrice,
      status: prodStatus,
      stock: numStock,
      category,
    });

    await emitUpdaterProducts(request); // Función para emitir por websocket

    response.status(201).json({
      status: "success",
      message: "Producto creado correctamente",
      payload: newProduct,
    });
  } catch (error) {
    response.status(500).json({ status: "error", message: `${error.name}: Error al crear el producto`, error: error.message });
  }
});

//PUT UPDATE
router.put("/:pid", async (request, response) => {
  //Logica anterior JSON y ProductManager
  // const pid = parseInt(request.params.pid);
  // const updateData = request.body;

  // const auxProduct = await ProductManager.getById(pid);
  // if (!auxProduct) {
  //   return response.status(400).json({
  //     error: "el producto no existe",
  //   });
  // }
  // if (isNaN(Number(updateData.price)) || isNaN(Number(updateData.stock))) {
  //   return response.status(400).json({ error: "price y stock deben ser números" });
  // }
  // const updateProduct = await ProductManager.updateById(pid, updateData);

  // response.status(200).json({
  //   message: "producto actualizado",
  //   product: updateProduct,
  // });

  const pid = request.params.pid;
  const updateData = request.body;

  // Validación básica de números
  if (("price" in updateData && isNaN(Number(updateData.price))) || ("stock" in updateData && isNaN(Number(updateData.stock)))) {
    return response.status(400).json({
      message: "price y stock deben ser números válidos si están presentes",
    });
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updateData, {
      new: true,
      runValidators: true, // aplica validaciones del schema
    });

    if (!updatedProduct) {
      return response.status(400).json({
        error: "el producto no existe",
        id: pid,
      });
    }

    response.status(200).json({
      message: "producto actualizado",
      product: updatedProduct,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Producto con ID ${pid} invalido`,
      });
    }
    response.status(500).json({
      message: `${error.name}: Hubo un problema al intentar actualizar el producto`,
      error: error.message,
    });
  }
});

//DELETE
router.delete("/:pid", async (request, response) => {
  //Logica anterior JSON y ProductManager
  // const pid = parseInt(request.params.pid);
  // const deleteProduct = await ProductManager.getById(pid);
  // if (!deleteProduct) {
  //   return response.status(400).json({ error: "producto no encontrado" });
  // }
  // const newProducts = await ProductManager.daleteById(pid);
  // const updatedProducts = await ProductManager.getAll();

  const pid = request.params.pid;
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return response.status(400).json({ status: "error", message: "producto no encontrado" });
    }

    await emitUpdaterProducts(request);
    response.status(200).json({
      message: "producto eliminado",
      products: deletedProduct,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(400).json({
        status: "error",
        message: `${error.name}: Producto con ID ${pid} invalido`,
      });
    }
    response.status(500).json({
      error: "error interno del servidor",
      details: error.message,
    });
  }
});

export default router;
