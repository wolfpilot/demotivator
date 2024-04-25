import express from "express"
import asyncWrapper from "@myrotvorets/express-async-middleware-wrapper"

// Controllers
import * as controller from "@controllers/quotesController"

// Schemas
import {
  quotesGetByIdSchema,
  quotesCreateSchema,
  quotesDeleteByIdSchema,
} from "@schemas/quotes/quotes.schema"

// Utils
import { validate } from "@utils/validationHelper"

const router = express.Router()

router.get("/", asyncWrapper(controller.list))
router.post(
  "/",
  validate({ body: quotesCreateSchema }),
  asyncWrapper(controller.create)
)
router.get(
  "/:id",
  validate({ params: quotesGetByIdSchema }),
  asyncWrapper(controller.getById)
)
router.delete(
  "/:id",
  validate({ params: quotesDeleteByIdSchema }),
  asyncWrapper(controller.deleteById)
)

export default router
