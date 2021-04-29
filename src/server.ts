// Server
import app from "./app"

const { SERVER_PORT = 9000 } = process.env

app.listen(SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${SERVER_PORT}...`)
})
