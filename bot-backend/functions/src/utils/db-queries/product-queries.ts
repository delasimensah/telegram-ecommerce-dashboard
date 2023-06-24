import { db } from "@utils/fb-admin";
import { Product, FormattedProduct } from "@utils/types";

// api queries
export const createProduct = async (product: Product) => {
  const collectionRef = db.collection("products");

  const snapshot = await collectionRef.where("name", "==", product.name).get();

  if (!snapshot.empty && snapshot.docs[0].data().name === product.name)
    throw Error("product exists");

  await collectionRef.add({ ...product, inStock: true });
};

export const getProduct = async (id: string) => {
  const ref = db.collection("products").doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) return;

  const product = snapshot.data() as Product;

  return product;
};

export const getAllProducts = async () => {
  const ref = db.collection("products");

  const snapshot = await ref.get();

  let products: FormattedProduct[] = [];

  if (!snapshot.empty) {
    products = snapshot.docs.map((doc) => {
      const { name, photo, description, category, inStock, prices } =
        doc.data() as Product;

      return {
        id: doc.id,
        name: {
          name,
          photo,
        },
        description,
        category,
        inStock,
        prices,
      };
    });
  }

  return products;
};

export const updateProduct = async (id: string, product: Product) => {
  const ref = db.collection("products").doc(id);
  await ref.update(product);
};

export const deleteProduct = async (id: string) => {
  const ref = db.collection("products").doc(id);
  await ref.delete();
};

// bot queries
export const getAllProductNames = async () => {
  const ref = db.collection("products");

  const snapshot = await ref.get();

  let products: string[] = [];

  if (!snapshot.empty) {
    products = snapshot.docs.map((doc) => doc.id);
  }

  return products;
};

export const getCategoryProductNames = async (category: string) => {
  const ref = db
    .collection("products")
    .where("category", "==", category)
    .where("inStock", "==", true);

  const snapshot = await ref.get();

  let products: string[] = [];

  if (!snapshot.empty) {
    products = snapshot.docs.map((doc) => doc.id);
  }

  return products;
};

export const getProductInfo = async (product: string) => {
  const collectionRef = db.collection("products");

  const snapshot = await collectionRef.where("name", "==", product).get();

  let productInfo: Product | null = null;

  if (!snapshot.empty) {
    productInfo = snapshot.docs[0].data() as Product;
  }

  return productInfo;
};
