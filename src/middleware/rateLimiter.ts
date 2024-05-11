import { Options, rateLimit } from "express-rate-limit"

// Utils
import { isRenderHost } from "@utils/envHelper"

const TIME_WINDOW_IN_MINUTES = 1
const MAX_REQUESTS_PER_WINDOW = 10

const config: Partial<Options> = {
  skip: () => !isRenderHost, // Disable during dev and test
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: TIME_WINDOW_IN_MINUTES * 60 * 1000,
  max: MAX_REQUESTS_PER_WINDOW,
  message: `You can only make ${MAX_REQUESTS_PER_WINDOW} every ${TIME_WINDOW_IN_MINUTES} minute(s).`,
}

export const rateLimiter = rateLimit(config)
