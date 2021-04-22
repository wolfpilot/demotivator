import express from "express"

const app = express()

app.get("/", (_req, res) => {
  res.send("Praise the sun! \\[T]/")
})

app.listen(9000, () => {
  console.log("Server listening on port 9000...")
})
