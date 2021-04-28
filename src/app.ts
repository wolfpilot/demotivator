import dotenvFlow from "dotenv-flow"
dotenvFlow.config()

import express from "express"

// Middleware
import { validationErrorMiddleware } from "./middleware/validation"

// Routes
import quotesRoutes from "./routes/quotesRoutes"

// Setup
const app = express()

// Body parser
app.use(express.json())

// Routes
app.use("/quotes", quotesRoutes)

// Error Middleware
app.use(validationErrorMiddleware)

export default app
