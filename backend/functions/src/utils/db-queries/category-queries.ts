import { db } from "@utils/fb-admin";
import { Category } from "@utils/types";

// api queries
export const createCategory = async (category: string) => {
  // const id = category.toLowerCase().replace(/ /g, "-");

  const collectionRef = db.collection("categories");

  // check if a category has the same name
  const snapshot = await collectionRef.where("name", "==", category).get();

  if (!snapshot.empty && snapshot.docs[0].data().name === category)
    throw Error("category already exists");

  await collectionRef.add({ name: category, active: true });
};

export const getCategory = async (id: string) => {
  const ref = db.collection("categories").doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) return;

  const category = snapshot.data() as Category;

  return category;
};

export const getAllCategories = async () => {
  const ref = db.collection("categories");

  const snapshot = await ref.get();

  let categories: Category[] = [];

  if (!snapshot.empty) {
    categories = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as Category;
    });
  }

  return categories;
};

export const updateCategory = async (id: string, category: Category) => {
  const ref = db.collection("categories").doc(id);
  await ref.update(category);
};

export const deleteCategory = async (id: string) => {
  const ref = db.collection("categories").doc(id);
  await ref.delete();
};

// bot queries
export const getActiveCategoryNames = async () => {
  const ref = db.collection("categories").where("active", "==", true);

  const snapshot = await ref.get();

  let categories: string[] = [];

  if (!snapshot.empty) {
    categories = snapshot.docs.map((doc) => doc.data().name);
  }

  return categories;
};
