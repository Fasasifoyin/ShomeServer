import { Router } from "express"
import { getSearch } from "../controllers/Search.js"

const router = Router()

router.get("/search", getSearch)

export default router