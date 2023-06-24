import type { Context } from "grammy";
import { addProductToCart } from "@utils/db-queries/cart-queries";

export const addToCart = async (ctx: Context, data: any) => {
  const id = ctx.msg?.chat.id;

  try {
    await addProductToCart(`${id}`, data);

    return ctx.answerCallbackQuery(`Added ${data.name} to cart`);
  } catch (error) {
    return ctx.answerCallbackQuery(`Something went wrong. Try again`);
  }
};
