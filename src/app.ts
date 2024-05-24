import express from "express"
import cors from "cors"

// Middleware
import { contentTypeValidator } from "@middleware/contentTypeValidator"
import { errorValidator } from "@middleware/errorValidator"
import { errorHandler } from "@middleware/errorHandler"
import { rateLimiter } from "@middleware/rateLimiter"
import { debugLogger, requestLogger, errorLogger } from "@middleware/logger"

// Routes
import quotesRoutes from "@routes/quotesRoutes"

// Setup
const app = express()

// Logging middlware
app.use(requestLogger)
app.use(debugLogger)

app.use(cors())

// Request validator
app.put("/*", contentTypeValidator("application/json"))
app.post("/*", contentTypeValidator("application/json"))
app.patch("/*", contentTypeValidator("application/json"))

// Body parser
app.use(express.json())

// Limiter middleware
app.use(rateLimiter)

// Routes
app.use("/quotes", quotesRoutes)

// Error middleware
app.use(errorValidator)
app.use(errorHandler)
app.use(errorLogger)

export default app
