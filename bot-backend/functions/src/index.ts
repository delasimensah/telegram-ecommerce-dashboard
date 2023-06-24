import { onRequest } from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { webhookCallback } from "grammy";
import * as express from "express";

import { bot } from "./bot";
import { api } from "@routes/api";

import {
  addToCategoriesArray,
  removeFromCategoriesArray,
} from "@cloud-events/category-events";
import {
  addToProductsArray,
  removeFromProductsArray,
} from "@cloud-events/product-events";

const app = express();

app.post("/", webhookCallback(bot, "express"));
app.use("/", api);

export const gBot = onRequest(app);

export const onCreateCategory = onDocumentCreated(
  "categories/{categoryId}",
  addToCategoriesArray
);

export const onDeleteCategory = onDocumentDeleted(
  "categories/{categoryId}",
  removeFromCategoriesArray
);

export const onCreateProduct = onDocumentCreated(
  "products/{productId}",
  addToProductsArray
);

export const onDeleteProduct = onDocumentDeleted(
  "products/{productId}",
  removeFromProductsArray
);

// dev
// https://api.telegram.org/bot6134184984:AAFYFSItZcYqcs14OJKSzs14FsRk_Ebw6-w/setWebhook?url=https://9aef-102-176-65-89.ngrok-free.app/motive-5fd18/us-central1/gBot

// prod
// https://api.telegram.org/bot6134184984:AAFYFSItZcYqcs14OJKSzs14FsRk_Ebw6-w/setWebhook?url=https://grammybot2-uw2y5fntfa-uc.a.run.app

// https://api.telegram.org/bot6134184984:AAFYFSItZcYqcs14OJKSzs14FsRk_Ebw6-w/deleteWebhook
