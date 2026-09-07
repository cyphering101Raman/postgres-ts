import { users } from "../schema/user.schema.js";
import { db } from "../db/connection.js";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const protectAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    }).from(users).where(eq(users.id, verifyToken.id));
    if (user.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.locals.user = user[0];
    next()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" })
  }
}