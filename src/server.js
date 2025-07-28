import express from "express";
//managers
import ProductManager from "./managers/ProductManager.js"; //logica anterior
//models ultima entrega
import ProductModel from "./models/product.model.js";
//db
import { connectMongoDB } from "./config/db.js";
//routes
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
//plantillas handlebars
import { engine } from "express-handlebars";

//SOCKET.IO
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
  const products = await ProductModel.find();
  socket.emit("update-products", products);
});

// server.listen(port, () => {
//   console.log(`servidor escuchando en http://localhost:${port}`);
// });

// migrare la config basica de mongoose a una carpeta especifica
//   .connect("mongodb+srv://admin:admin1234@cluster0.bm6y9cu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((e) => console.error("❌ MongoDB connection error:\n", e));

await connectMongoDB(); //conexion

httpServer.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
