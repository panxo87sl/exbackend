import fs from "fs/promises";
class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./data/carts.json";
  }

  //GET
  async getAll() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      // return this.products;
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  //GET ID
  async getById(cid) {
    const dataCarts = await this.getAll();
    return dataCarts.find((item) => item.id === cid);
  }

  //POST
  async add() {
    const dataCarts = await this.getAll();
    const newCart = {
      id: dataCarts.length + 1,
      products: [],
    };
    dataCarts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(dataCarts));
    return newCart;
  }

  //POST Product to Cart
  async addProductToCart(cid, pid) {
    const dataCarts = await this.getAll();
    const auxCart = dataCarts.find((item) => item.id === cid);
    const listProductsOnCart = auxCart.products; //lista de productos en el carro
    const indexProductOnCart = listProductsOnCart.findIndex(
      (item) => item.id === pid
    ); //me devuelve el indice donde esta el objeto en el carro

    if (indexProductOnCart === -1) {
      const newProductToCart = { id: pid, quantity: 1 }; //si no existe se crea el objeto
      listProductsOnCart.push(newProductToCart);
    } else {
      listProductsOnCart[indexProductOnCart].quantity++; //si existe se aumenta su cantidad
    }
    await fs.writeFile(this.path, JSON.stringify(dataCarts));
    return auxCart;
  }
}

export default new CartManager();
