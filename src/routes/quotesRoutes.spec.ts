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

describe("POST /quotes", () => {
  it("should create a new quote with text and author", async () => {
    const mockData = {
      author: "Douglas Adams",
      text:
        "The story so far: In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
    }

    const resQuotesCreate = await req(app).post("/quotes").send(mockData)

    expect(resQuotesCreate.status).toBe(201)

    const resQuotesGetById = await req(app).get(
      `/quotes/${resQuotesCreate.body.data.id}`
    )

    expect(resQuotesGetById.status).toBe(200)
    expect(resQuotesGetById.body.data.author).toEqual(mockData.author)
    expect(resQuotesGetById.body.data.text).toEqual(mockData.text)
  })

  it("should create a new quote with text and NO author", async () => {
    const mockData = {
      author: "",
      text:
        "Do not take life too seriously. You will never get out of it alive.",
    }

    const resQuotesCreate = await req(app).post("/quotes").send(mockData)

    expect(resQuotesCreate.status).toBe(201)

    const resQuotesGetById = await req(app).get(
      `/quotes/${resQuotesCreate.body.data.id}`
    )

    expect(resQuotesGetById.status).toBe(200)
    expect(resQuotesGetById.body.data.author).toEqual(mockData.author)
    expect(resQuotesGetById.body.data.text).toEqual(mockData.text)
  })

  it("should fail creating a quote when no text is passed", async () => {
    const mockData = {
      author: "Elbert Hubbard",
      text: "",
    }

    const resQuotesCreate = await req(app).post("/quotes").send(mockData)

    expect(resQuotesCreate.status).toBe(400)
  })
})
