import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import { v4 as uuidv4 } from "uuid";
import Product from "../../../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe("Product Repository test", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });
  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const id = uuidv4();
    const product = new Product(id, "Shoes", 50);
    // Act
    await productRepository.create(product);

    // Assert
    const createdProduct = await ProductModel.findOne({ where: { id } });
    expect(createdProduct.toJSON()).toStrictEqual({
        id: id,
        name: "Shoes",
        price: 50,
    });
  });

  it("should find a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const id = uuidv4();
    const product = new Product(id, "Shoes", 50);
    await ProductModel.create({ id, name: "Shoes", price: 50 });
    // Act
    const foundProduct = await productRepository.find(id);

    // Assert
    expect(foundProduct).toStrictEqual(product);
  });

  it ("should find all products", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const id1 = uuidv4();
    const id2 = uuidv4();
    const product1 = new Product(id1, "Shoes", 50);
    const product2 = new Product(id2, "Socks", 5);
    await ProductModel.create({ id: id1, name: "Shoes", price: 50 });
    await ProductModel.create({ id: id2, name: "Socks", price: 5 });
    // Act
    const foundProducts = await productRepository.findAll();

    // Assert
    expect(foundProducts).toStrictEqual([product1, product2]);
  });

  it ("should update a product", async () => {
    // Arrange
    const productRepository = new ProductRepository();
    const id = uuidv4();
    const product = new Product(id, "Shoes", 50);
    await ProductModel.create({ id, name: "Shoes", price: 50 });
    product.changeName("Sneakers");
    product.changePrice(60);
    // Act
    await productRepository.update(product);

    // Assert
    const updatedProduct = await ProductModel.findOne({ where: { id } });
    expect(updatedProduct.toJSON()).toStrictEqual({
        id: id,
        name: "Sneakers",
        price: 60,
    });
  });
});
