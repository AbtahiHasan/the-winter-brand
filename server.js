"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./utils/db"));
const port = config_1.default.port || 8000;
app_1.app.listen(port, () => {
    console.log(`server is running at ${port}`);
    (0, db_1.default)();
});
