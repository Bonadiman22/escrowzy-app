import { Router, Request, Response } from "express";
import { AuthProvider, AuthContext } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Rota de registro
router.post("/register", (req: Request, res: Response) => {
  // Implementar lógica de registro usando AuthProvider
});

// Rota de login
router.post("/login", (req: Request, res: Response) => {
  // Implementar lógica de login usando AuthProvider
});

// Rota protegida (perfil)
router.get("/profile", authMiddleware, (req: Request, res: Response) => {
  // Implementar lógica de perfil usando AuthContext
});

export default router;
