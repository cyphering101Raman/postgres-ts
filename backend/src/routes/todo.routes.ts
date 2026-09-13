import Router from "express";
import { protectAuth } from "../middleware/auth.middleware.js";
import { createTodo, getAllTodos, deleteTodo } from "../controller/todo.controller.js";
import { validateData } from "../middleware/validate.middleware.js";
import { insertTodoSchema } from "../schema/document.schema.js";

const router = Router();

router.post("/create", protectAuth, validateData(insertTodoSchema), createTodo);
router.get("/all", protectAuth, getAllTodos);
router.delete("/delete/:id", protectAuth, deleteTodo);

export default router;