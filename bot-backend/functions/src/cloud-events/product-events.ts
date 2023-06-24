import * as fs from "fs";

import { products } from "@utils/helpers/products-array";

import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

const updateProductsFile = (data: string[]) => {
  const filePath = "./src/utils/helpers/products-array.ts";
  const content = "export const products: string[] =" + JSON.stringify(data);

  fs.writeFile(filePath, content, (error) => {
    if (error) {
      console.error("Error writing to file:", error);
    } else {
      console.log("File written successfully.");
    }
  });
};

export const addToProductsArray = (
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    { productId: string }
  >
) => {
  const snapshot = event.data;

  if (!snapshot?.exists) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot?.data();
  const name = data?.name;

  products.push(name);

  updateProductsFile(products);
};

export const removeFromProductsArray = (
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    { productId: string }
  >
) => {
  const snapshot = event.data;
  const name = snapshot?.id;

  const updatedCategories = products.filter((product) => product !== name);

  updateProductsFile(updatedCategories);
};
