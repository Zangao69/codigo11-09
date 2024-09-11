
import { Router } from "express";
import {checkUser, editUser, getUserById, login, register} from "../controllers/usuarioController"


//MIDDLEWARES /helper
import verifyToken from "../helpers/verify-token.js"
import imageUpload from "../helpers/image-upload";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/checkuser", checkUser)
router.get("/:id", getUserById)
router.put("/edit/:id", verifyToken, imageUpload.single("imagem") ,editUser)

export default router 