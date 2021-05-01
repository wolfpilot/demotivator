import express from "express"

// Middleware
import { debugLogger, requestLogger } from "@middleware/logger"
import { validationErrorMiddleware } from "@middleware/validation"

// Routes
import quotesRoutes from "@routes/quotesRoutes"

// Setup
const app = express()

// Body parser
app.use(express.json())

app.use(debugLogger)
app.use(requestLogger)

// Routes
app.use("/quotes", quotesRoutes)

// Error Middleware
app.use(validationErrorMiddleware)

export default app
