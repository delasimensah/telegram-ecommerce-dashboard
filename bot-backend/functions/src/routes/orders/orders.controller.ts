import { Request, Response } from "express";

export async function httpGetOrders(req: Request, res: Response) {
  res.status(200).json({ message: "get all orders endpoint" });
}
