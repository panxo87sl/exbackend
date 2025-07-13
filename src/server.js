import express from "express";
//routes
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

//plantillas handlebars
import { engine } from "express-handlebars";

//instancia y configuracion server
const server = express(); //instancia principal
server.use(express.json()); //midleware para que el server interprete JSON
const port = "8080"; //variable puerto

//se montan los routers
server.use("/api/products", productsRouter); //implementacion router
server.use("/api/carts", cartsRouter); //implementacion router
server.use("/", viewsRouter);
//handlebars
server.engine("handlebars", engine());
server.set("views", import.meta.dirname + "/views");
server.set("view engine", "handlebars"); //motor de vistas que se van a utilizar

server.listen(port, () => {
  console.log(`servidor escuchando en http://localhost:${port}`);
});
