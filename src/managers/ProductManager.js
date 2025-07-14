import fs from "fs/promises";
class ProductManager {
  constructor() {
    this.path = import.meta.dirname + "/../data/products.json";
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
  async getById(pid) {
    const dataProducts = await this.getAll();
    return dataProducts.find((item) => item.id === pid);
  }
  //POST ADD
  async add(id, title, description, code, numPrice, prodStatus, numStock, category) {
    const dataProducts = await this.getAll();

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
    dataProducts.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(dataProducts));
    return newProduct;
  }
  //PUT UPDATE
  async updateById(pid, updateData) {
    const dataProducts = await this.getAll();
    const auxIndex = dataProducts.findIndex((item) => item.id === pid);
    dataProducts[auxIndex] = {
      ...dataProducts[auxIndex],
      ...updateData,
      id: pid, //para evitar actualizar el ID
    };
    await fs.writeFile(this.path, JSON.stringify(dataProducts));
    return dataProducts[auxIndex];
  }
  //DELETE
  async daleteById(pid) {
    const dataProducts = await this.getAll();
    const deleteIndex = dataProducts.findIndex((item) => item.id === pid);
    dataProducts.splice(deleteIndex, 1);
    await fs.writeFile(this.path, JSON.stringify(dataProducts));
    return this.getAll();
  }
}
export default new ProductManager();
