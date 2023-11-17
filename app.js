"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeCache = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_1 = __importDefault(require("http-status"));
const node_cache_1 = __importDefault(require("node-cache"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorHandler_middleware_1 = __importDefault(require("./middleware/errorHandler.middleware"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const marketing_routes_1 = __importDefault(require("./routes/marketing.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const layout_routes_1 = __importDefault(require("./routes/layout.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
exports.app = (0, express_1.default)();
exports.nodeCache = new node_cache_1.default();
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
// app.use(cors({
//     origin: config.origin
// }))
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies and authorization headers
}));
exports.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
exports.app.use((0, helmet_1.default)());
exports.app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json());
exports.app.use("/api/v1", product_routes_1.default, user_routes_1.default, review_routes_1.default, order_routes_1.default, marketing_routes_1.default, contact_routes_1.default, layout_routes_1.default, cart_routes_1.default, analytics_routes_1.default);
exports.app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Api is working"
    });
});
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = http_status_1.default.NOT_FOUND;
    next(err);
});
exports.app.use(errorHandler_middleware_1.default);
