import express from "express";
import { db } from "./db/index.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json(
    {
      message: "Hello darling"
    }
  )
})


export default app;