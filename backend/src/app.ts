import express from "express";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.routes.js"
import todoRouter from "./routes/todo.routes.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json(
    {
      message: "Hello darling"
    }
  )
});

// Serve the API tester page
app.get("/test", (req, res) => {
  res.sendFile("home.html", { root: process.cwd() });
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/todo', todoRouter);

// implementing global error state handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = (err as any).statusCode || 500;
  const message = (err as any).message || "Internal server error";
  return res.status(statusCode).json({ message });
});

export default app;