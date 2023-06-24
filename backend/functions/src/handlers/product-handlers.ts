import type { Context } from "grammy";
import {
  getCategoryProductNames,
  getProductInfo,
} from "@utils/db-queries/product-queries";
import { getCategory } from "@utils/db-queries/category-queries";

const buttons = [{ text: "Cart" }, { text: "Categories" }];

export const showProducts = async (ctx: Context) => {
  const text = ctx.msg?.text;

  try {
    const category = await getCategory(text as string);

    if (!category?.active) {
      return ctx.reply("This category is not active");
    }

    const products = await getCategoryProductNames(text as string);

    if (!products.length) {
      return ctx.reply("There are no products available at the moment", {
        reply_markup: {
          keyboard: [[{ text: "Categories" }]],
          resize_keyboard: true,
        },
      });
    }

    const productButtons = products.map((product) => [{ text: product }]);

    return ctx.reply("Choose product", {
      reply_markup: {
        keyboard: [...productButtons, [...buttons]],
        resize_keyboard: true,
      },
    });
  } catch (error) {
    return ctx.reply("Something went wrong. Try again");
  }
};

export const showProductDetails = async (ctx: Context) => {
  const text = ctx.msg?.text;
  const chatId = ctx.msg?.chat.id;

  try {
    const product = await getProductInfo(text as string);

    if (!product || !product?.inStock) {
      return ctx.reply("This product is not in stock");
    }

    const priceButtons = product.prices.map(
      (price: { name: string; price: number }) => [
        {
          text: `Buy ${price.name} @ ${price.price}`,
          callback_data: JSON.stringify({
            name: price.name,
            price: price.price,
          }),
        },
      ]
    );

    return await Promise.all([
      ctx.api.sendPhoto(
        chatId as number,
        product.photo ||
          "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
      ),
      ctx.api.sendMessage(
        chatId as number,
        `<b>${product.name}</b>
${product?.description}
`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [...priceButtons],
          },
        }
      ),
    ]);
  } catch (error: any) {
    console.log(error.message);
    return ctx.reply("Something went wrong. Try again");
  }
};
