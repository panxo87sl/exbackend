import express from "express";
//routes
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
//managers
import ProductManager from "./managers/ProductManager.js";
//plantillas handlebars
import { engine } from "express-handlebars";
//socket.io
// import serverHttp from "http";
import { createServer } from "http";
import { Server } from "socket.io";
//FIN IMPORTS

//instancia y configuracion server
const server = express(); //instancia principal
const port = "8080"; //variable puerto
server.use(express.json()); //midleware para que el server interprete JSON

//config handlebars
server.engine("handlebars", engine());
server.set("views", import.meta.dirname + "/views");
server.set("view engine", "handlebars"); //motor de vistas que se van a utilizar
//middleware
server.use(express.static(import.meta.dirname + "/public"));
//se montan los routers
server.use("/api/products", productsRouter); //implementacion router
server.use("/api/carts", cartsRouter); //implementacion router
server.use("/", viewsRouter);
//socket.io
const httpServer = createServer(server);
const io = new Server(httpServer);
server.set("io", io);

io.on("connection", async (socket) => {
  console.log("Cliente conectado a WebSocket: " + socket.id);
  const products = await ProductManager.getAll();
  socket.emit("update-products", products);
});

// server.listen(port, () => {
//   console.log(`servidor escuchando en http://localhost:${port}`);
// });
httpServer.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
