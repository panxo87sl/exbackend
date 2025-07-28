console.log("Hola desde la carpeta Public");
const socket = io();

socket.on("update-products", (products) => {
  console.log("Lista actualizada recibida en cliente:", products);

  const list = document.getElementById("product-list");
  list.innerHTML = "";
  if (products.length > 0) {
    products.forEach((product) => {
      // const li = document.createElement("li");
      // li.innerHTML = `<strong>${product.title}</strong> - $${product.price} - Stock: ${product.stock} - SKU: ${product.id}`;
      // list.appendChild(li);
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
      <span class="stock">Stock: ${product.stock}</span>
      <span class="sku">SKU: ${product.code}</span>
      <h3 class="title">${product.title}</h3>
      <p class="price"><strong>$${product.price}</strong></p>
    `;
      list.appendChild(card);
    });
  } else {
    const divMessage = document.createElement("div");
    divMessage.innerHTML = `<span>No hay productos disponibles</span>`;
    list.appendChild(divMessage);
  }
});
