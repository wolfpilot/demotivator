import req from "supertest"
import fs from "fs"
import path from "path"

// Express
import app from "@src/app"

// Data
import { quotesMockData, quotesMockPagination } from "@mocks/quotesMock"

// Utils
import { pool } from "@utils/dbHelper"

const sql = fs
  .readFileSync(path.resolve(__dirname, "../database/seeds/quotesSeed.sql"))
  .toString()

beforeEach(async () => {
  await pool.query(sql)
})

afterEach(async () => {
  await pool.query("DROP TABLE IF EXISTS quotes;")
})

afterAll(async () => {
  /**
   * Fix Jest not exiting after test suite is completed
   *
   * @see https://github.com/facebook/jest/issues/7287
   */
  pool.end()
})

describe("GET /quotes", () => {
  it("should retrieve the default first page of quotes", async () => {
    const res = await req(app).get("/quotes")
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(quotesMockData)
    expect(res.body.pagination).toEqual(quotesMockPagination)
  })

  it("should retrieve a specific page of quotes", async () => {
    const res = await req(app).get("/quotes?limit=2&page=4")
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([quotesMockData[6], quotesMockData[7]])
    expect(res.body.pagination).toEqual({
      totalRecords: "10",
      totalPages: 5,
      currentPage: 4,
      nextPage: 5,
      prevPage: 3,
    })
  })

  it("should fail to retrieve quotes when parameters fall out of bounds", async () => {
    const res1 = await req(app).get("/quotes?limit=0")
    expect(res1.status).toBe(400)

    const res2 = await req(app).get("/quotes?page=0")
    expect(res2.status).toBe(400)

    const res3 = await req(app).get("/quotes?limit=500")
    expect(res3.status).toBe(404)

    const res4 = await req(app).get("/quotes?page=100")
    expect(res4.status).toBe(404)

    const res5 = await req(app).get("/quotes?limit=5&page=3")
    expect(res5.status).toBe(404)
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
      `/quotes/${resQuotesCreate.body.data}`
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
      `/quotes/${resQuotesCreate.body.data}`
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

describe("GET /quotes:id", () => {
  it("should retrieve a single quote with a populated id", async () => {
    const res = await req(app).get("/quotes/1")
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual(quotesMockData[0])
  })

  it("should fail retrieving a quote with non-existent ids", async () => {
    const res1 = await req(app).get("/quotes/11")
    expect(res1.status).toBe(404)

    const res2 = await req(app).get("/quotes/999")
    expect(res2.status).toBe(404)
  })

  it("should fail retrieving a quote with an id lower than 1", async () => {
    const res1 = await req(app).get("/quotes/0")
    expect(res1.status).toBe(400)

    const res2 = await req(app).get("/quotes/-5")
    expect(res2.status).toBe(400)
  })

  it("should fail retrieving a quote when id is not a number", async () => {
    const res1 = await req(app).get("/quotes/abc")
    expect(res1.status).toBe(400)

    const res2 = await req(app).get("/quotes/123abc456")
    expect(res2.status).toBe(400)
  })
})

describe("DELETE /quotes:id", () => {
  it("should delete the specified quote if it exists", async () => {
    const res = await req(app).delete("/quotes/5")
    expect(res.status).toBe(204)
  })

  it("should fail deleting non-existend quotes", async () => {
    const res1 = await req(app).delete("/quotes/0")
    expect(res1.status).toBe(400)

    const res2 = await req(app).delete("/quotes/-5")
    expect(res2.status).toBe(400)

    const res3 = await req(app).delete("/quotes/999")
    expect(res3.status).toBe(404)

    const res4 = await req(app).delete("/quotes/abc")
    expect(res4.status).toBe(400)

    const res5 = await req(app).delete("/quotes/123abc456")
    expect(res5.status).toBe(400)
  })
})
