"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routers/user"));
const subscribe_1 = __importDefault(require("./routers/subscribe"));
const constants_1 = require("./constants");
const RedisStore = connect_redis_1.default(express_session_1.default);
exports.redis = new ioredis_1.default(process.env.REDIS_URL);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.set("proxy", 1);
    app.use(express_1.default.json());
    app.use(cors_1.default({
        origin: ["http://localhost:3000"],
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: "tangobox",
        store: new RedisStore({
            client: exports.redis,
            disableTTL: true,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
            domain: constants_1.__prod__ ? ".tangobox.app" : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    app.use("/user", user_1.default);
    app.use("/subscribe", subscribe_1.default);
    app.get("/", (_, res) => {
        res.send("hi");
    });
    app.listen(process.env.PORT, () => {
        console.log("express is on 4000");
    });
});
main();
//# sourceMappingURL=index.js.map