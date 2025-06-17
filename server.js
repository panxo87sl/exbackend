import express from "express";
const server = express(); //instancia principal
const port = "8080";

server.listen(port, () => console.log(`listening en el fuckin puerto ${port}`));
