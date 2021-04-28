import req from "supertest"

// Express
import app from "../app"

// Data
import { quotesMock } from "../mocks/quotesMock"

/**
 * Fix Jest not exiting after test suite is completed
 *
 * More info at:
 * https://github.com/facebook/jest/issues/7287
 */
afterAll(async (done) => {
  // await pool.end()
  done()
})

describe("GET /quotes", () => {
  it("should list all the quotes", async () => {
    const res = await req(app).get("/quotes")

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(quotesMock)
  })
})
