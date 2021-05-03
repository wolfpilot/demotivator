import express from "express"

// Middleware
import { errorValidator } from "@root/src/middleware/errorValidator"
import { errorHandler } from "@middleware/errorHandler"
import { debugLogger, requestLogger, errorLogger } from "@middleware/logger"

// Routes
import quotesRoutes from "@routes/quotesRoutes"

// Setup
const app = express()

// Logging middlware
app.use(requestLogger)
app.use(debugLogger)

// Body parser
app.use(express.json())

// Routes
app.use("/quotes", quotesRoutes)

// Error middleware
app.use(errorValidator)
app.use(errorHandler)
app.use(errorLogger)

export default app
