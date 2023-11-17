import { app } from "./app"
import config from "./config"
import connectDb from "./utils/db"
const port = config.port || 8000

app.listen(port, () => {
    console.log(`server is running at ${port}`)
    connectDb()
})