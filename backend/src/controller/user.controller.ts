// creaate the register controller
import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { db } from "../db/connection.js"
import { users } from "../schema/user.schema.js"
import { eq } from "drizzle-orm";
import { log } from "console";

export const options: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await db.select().from(users).where(eq(users.email, email));

    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    console.log(newUser);

    const token = jwt.sign({ id: newUser[0].id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      });


    const { password: _, ...safeUser } = newUser[0];

    return res.status(201)
      .cookie("token", token, options)
      .json({
        message: "User registered successfully",
        user: safeUser,
        token
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await db.select().from(users).where(eq(users.email, email));

    if (userExists.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExists[0].password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: userExists[0].id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      });

    return res.status(200)
      .cookie("token", token, options)
      .json({
        message: "User logged in successfully",
        token
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    return res.status(200)
      .clearCookie("token", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export const getMe = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}