import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Rota de registro
router.post("/register", AuthController.register);

// Rota de login
router.post("/login", AuthController.login);

// Rota protegida (perfil)
router.get("/profile", authMiddleware, AuthController.profile);

export default router;
