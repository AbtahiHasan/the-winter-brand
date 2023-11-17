import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import httpStatus from "http-status"
import NodeCache from "node-cache"
import morgan from "morgan"
import helmet from "helmet"
import bodyParser from "body-parser"
import config from "./config"
import errorHandlerMiddleware from "./middleware/errorHandler.middleware"
import productRouter from "./routes/product.routes"
import userRouter from "./routes/user.routes"
import reviewRouter from "./routes/review.routes"
import orderRouter from "./routes/order.routes"
import marketingRouter from "./routes/marketing.routes"
import contactRouter from "./routes/contact.routes"
import layoutRouter from "./routes/layout.routes"
import cartRouter from "./routes/cart.routes"
import analyticsRouter from "./routes/analytics.routes"

export const app: Application = express()
export const nodeCache = new NodeCache()

app.use(morgan("dev"))
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
// app.use(cors({
//     origin: config.origin
// }))


app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies and authorization headers
}))

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use("/api/v1", productRouter, userRouter, reviewRouter, orderRouter, marketingRouter, contactRouter, layoutRouter, cartRouter, analyticsRouter)
app.get("/test", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "Api is working"
    })
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = httpStatus.NOT_FOUND
    next(err)
})

app.use(errorHandlerMiddleware)