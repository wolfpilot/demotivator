import express from "express"

// Controllers
import * as controller from "../controllers/quotesController"

// Schemas
import { quotesGetByIdSchema } from "../../schemas/quotes/quotes.schema"

// Utils
import { validate } from "../../utils/validationHelper"

const router = express.Router()

router.get("/", controller.list)
// router.post("/", controller.create)
router.get(
  "/:id",
  validate({ params: quotesGetByIdSchema }),
  controller.getById
)
// router.delete("/:id", controller.deleteById)

export default router
