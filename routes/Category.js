import { Router } from "express"
import { getCategory } from "../controllers/Category.js"

const router = Router()

router.get("/", getCategory)

export default router