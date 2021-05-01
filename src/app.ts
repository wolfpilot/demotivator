import express from "express"

// Middleware
import { validationErrorMiddleware } from "@middleware/validation"
import { errorHandler } from "@middleware/errorHandler"
import { debugLogger, requestLogger, errorLogger } from "@middleware/logger"

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
app.use(errorHandler)
app.use(errorLogger)

export default app
