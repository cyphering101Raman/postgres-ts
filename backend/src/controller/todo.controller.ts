
import { Request, Response } from "express";
import { todos } from "../schema/document.schema.js";
import { db } from "../db/connection.js";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../utils/asyncHandler.js";


// @route   POST /api/v1/todo/create
// @desc    Create a todo
// @access  Private
export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const newTodo = await db.insert(todos).values({
    title,
    description,
    userId: user.id
  }).returning();

  return res.status(201).json({ message: "Todo created successfully", newTodo });

});


// @route   GET /api/v1/todo/all
// @desc    Get all todos
// @access  Private
export const getAllTodos = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const allTodos = await db.select({
    id: todos.id,
    title: todos.title,
    description: todos.description,
    completed: todos.completed,
    createdAt: todos.createdAt,
    updatedAt: todos.updatedAt,
  }).from(todos).where(eq(todos.userId, user.id)).limit(limit).offset(skip);

  return res.status(200).json({ message: "Todos fetched successfully", allTodos });
});


// @route   DELETE /api/v1/todo/delete/:id
// @desc    Delete a todo
// @access  Private
export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const user = res.locals.user;
  const { id } = req.params;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const deletedTodo = await db.delete(todos).where(eq(todos.id, Number(id))).returning();

  return res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
});