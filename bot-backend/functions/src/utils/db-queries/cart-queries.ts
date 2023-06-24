import { db } from "@utils/fb-admin";

export const addProductToCart = async (chatId: string, data: any) => {
  await db.collection("users").doc(chatId).collection("cart").add(data);
};

export const removeProductFromCart = async (chatId: string, id: string) => {
  await db.collection("users").doc(chatId).collection("cart").doc(id).delete();
};
