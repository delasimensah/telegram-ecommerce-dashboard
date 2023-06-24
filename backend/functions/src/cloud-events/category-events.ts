import * as fs from "fs";

import { categories } from "@utils/helpers/categories-array";

import {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

const updateFile = (data: string[]) => {
  const filePath = "./src/utils/helpers/categories-array.ts";
  const content = "export const categories: string[] =" + JSON.stringify(data);

  fs.writeFile(filePath, content, (error) => {
    if (error) {
      console.error("Error writing to file:", error);
    } else {
      console.log("File written successfully.");
    }
  });
};

export const addToCategoriesArray = (
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    { categoryId: string }
  >
) => {
  const snapshot = event.data;

  if (!snapshot?.exists) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot?.data();
  const name = data?.name;

  categories.push(name);
  updateFile(categories);
};

export const removeFromCategoriesArray = (
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    { categoryId: string }
  >
) => {
  const snapshot = event.data;
  const name = snapshot?.data().name;

  const updatedCategories = categories.filter((category) => category !== name);

  updateFile(updatedCategories);
};
