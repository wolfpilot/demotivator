import express from "express"

// Controllers
import * as controller from "../controllers/quotesController"

// Schemas
import {
  quotesGetByIdSchema,
  quotesCreateSchema,
  quotesDeleteByIdSchema,
} from "../../schemas/quotes/quotes.schema"

// Utils
import { validate } from "../../utils/validationHelper"

const router = express.Router()

router.get("/", controller.list)
router.post("/", validate({ body: quotesCreateSchema }), controller.create)
router.get(
  "/:id",
  validate({ params: quotesGetByIdSchema }),
  controller.getById
)
router.delete(
  "/:id",
  validate({ params: quotesDeleteByIdSchema }),
  controller.deleteById
)

export default router
