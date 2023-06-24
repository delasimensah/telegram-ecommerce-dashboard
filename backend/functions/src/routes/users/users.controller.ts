import { Request, Response } from "express";

export async function httpGetUsers(req: Request, res: Response) {
  res.status(200).json({ message: "get all users endpoint" });
}
