import req from "supertest"
import fs from "fs"
import path from "path"

// Express
import app from "../app"

// Data
import { quotesMock } from "../mocks/quotesMock"

// Utils
import { pool } from "../utils/dbHelper"

const sql = fs
  .readFileSync(path.resolve(__dirname, "../database/seeds/quotesSeed.sql"))
  .toString()

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      author VARCHAR(128),
      text TEXT NOT NULL
    );
  `)
})

beforeEach(async () => {
  await pool.query(sql)
})

afterEach(async () => {
  await pool.query("DELETE FROM quotes;")
})

afterAll(async () => {
  await pool.query("DROP TABLE IF EXISTS quotes;")

  /**
   * Fix Jest not exiting after test suite is completed
   *
   * More info at:
   * https://github.com/facebook/jest/issues/7287
   */
  pool.end()
})

describe("GET /quotes", () => {
  it("should list all the quotes", async () => {
    const res = await req(app).get("/quotes")

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(quotesMock)
  })
})
