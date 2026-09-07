import { Router } from "express";
import { loginUser, logout, registerUser, getMe } from "../controller/user.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/me", protectAuth, getMe);

export default router;