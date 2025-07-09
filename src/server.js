import express from "express";
//routes
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
//plantillas handlebars
import hbs from "express-handlebars";

//instancia y configuracion server
const server = express(); //instancia principal
server.use(express.json()); //midleware para que el server interprete JSON
const port = "8080"; //variable puerto

//se montan los routers
server.use("/api/products", productsRouter); //implementacion router
server.use("/api/carts", cartsRouter); //implementacion router

server.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
