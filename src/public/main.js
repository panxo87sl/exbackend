console.log("Hola desde la carpeta Public");
const socket = io();

socket.on("update-products", (products) => {
  console.log("Lista actualizada recibida en cliente:", products);

  const list = document.getElementById("product-list");
  list.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${product.title}</strong> - $${product.price} - Stock: ${product.stock} - SKU: ${product.id}`;
    list.appendChild(li);
  });
});
