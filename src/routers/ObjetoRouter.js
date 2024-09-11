import { Router } from "express";
import { create } from "../controllers/ObjetoController";

const router = Router();

//helpes
import verifyToken from "../helper/"

router.post("/", create);

export default router;