import express from "express"

//
import * as controller from "../controllers/quotesController"

const router = express.Router()

router.get("/", controller.list)
// router.post("/", controller.create)
router.get("/:id", controller.getById)
// router.delete("/:id", controller.deleteById)

export default router
