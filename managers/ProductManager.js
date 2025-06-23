class ProductManager {
  constructor() {
    this.products = [];
  }
  getAll() {
    return this.products;
  }
  getById(pid) {
    return this.products.find((item) => item.id === pid);
  }
  add(id, title, description, code, numPrice, numStock, prodStatus, category) {
    const newProduct = {
      id,
      title,
      description,
      code,
      price: numPrice,
      prodStatus,
      stock: numStock,
      category,
    };
    this.products.push(newProduct);
    return newProduct;
  }
  updateById(pid, updateData) {
    const auxIndex = this.products.findIndex((item) => item.id === pid);
    this.products[auxIndex] = {
      ...this.products[auxIndex],
      ...updateData,
      id: pid, //para evitar actualizar el ID
    };
    return this.products[auxIndex];
  }
  daleteById(pid) {
    const deleteIndex = this.products.findIndex((item) => item.id === pid);
    this.products.splice(deleteIndex, 1);
    return this.products;
  }
}
export default new ProductManager();
