class CartManager {
  constructor() {
    this.carts = [];
  }
  getAll() {
    return this.carts;
  }
  getById(cid) {
    return this.carts.find((item) => item.id === cid);
  }
  add() {
    const newCart = {
      id: this.carts.length + 1,
      products: [],
    };
    this.carts.push(newCart);
    return newCart;
  }
  addProductToCart(cid, pid) {
    const auxCart = this.getById(cid);
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
    return auxCart;
  }
}

export default new CartManager();
