import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    origin: process.env.ORIGIN,
    database_url: process.env.DATABASE_URL,
    payment_secret: process.env.PAYMENT_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
}