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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const uniqid_1 = __importDefault(require("uniqid"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pouchdb_1 = __importDefault(require("pouchdb"));
const getDueTime_1 = require("../utils/getDueTime");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const server = new pouchdb_1.default(`${process.env.COUCH_SERVER}/_users`);
const couchAddUser = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    yield server
        .put({
        _id: `org.couchdb.user:${uuid}`,
        name: uuid,
        password: uuid,
        roles: [],
        type: "user",
    })
        .then(() => {
        console.log("couch user created");
    })
        .catch((err) => {
        console.log(err);
    });
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email: content.email },
    });
    console.log(user);
    if (!user) {
        res.send({
            error: { field: "email", message: "登入失敗，請確認Email或密碼" },
        });
        return;
    }
    if (!user.password) {
        res.send({
            error: { field: "email", message: "登入失敗，請確認Email或密碼" },
        });
        return;
    }
    const valid = yield bcrypt_1.default.compare(content.password, user.password);
    if (!valid) {
        res.send({
            error: { field: "email", message: "登入失敗，請確認Email或密碼" },
        });
        return;
    }
    req.session.userId = user.id.toString();
    res.send({
        user: {
            email: user.email,
            uuid: user.uuid,
            role: user.role,
            due: user.due,
        },
    });
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (!content.token) {
        res.send({
            error: { field: "re", message: "auth failed!" },
        });
        return;
    }
    const recaptcha = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${content.token}`);
    if (!recaptcha.data.success || recaptcha.data.action !== "signup") {
        res.send({
            error: { field: "re", message: "auth failed!" },
        });
        return;
    }
    if (yield prisma.user.findFirst({ where: { email: content.email } })) {
        res.send({
            error: { field: "email", message: "電子郵件已被使用" },
        });
        return;
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(content.password, salt);
    const uuid = uniqid_1.default.time();
    const user = yield prisma.user.create({
        data: {
            uuid,
            email: content.email,
            password: hashedPassword,
            due: getDueTime_1.getDueTime(30),
        },
    });
    yield couchAddUser(uuid);
    req.session.userId = user.id.toString();
    res.send({
        user: {
            email: user.email,
            uuid: user.uuid,
            role: user.role,
            due: user.due,
        },
    });
}));
router.post("/google", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const check = yield jwt_simple_1.default.decode(content.token, "secret", true);
    if (check.email !== content.email) {
        res.send({
            error: {
                field: "auth",
                message: "驗證失敗",
            },
        });
        return;
    }
    const user = yield prisma.user.findUnique({
        where: { email: content.email },
    });
    if (!user) {
        const uuid = uniqid_1.default.time();
        const newUser = yield prisma.user.create({
            data: {
                uuid,
                email: content.email,
                due: getDueTime_1.getDueTime(30),
            },
        });
        yield couchAddUser(uuid);
        req.session.userId = newUser.id.toString();
        res.send({
            user: {
                email: newUser.email,
                uuid: newUser.uuid,
                role: newUser.role,
                due: newUser.due,
            },
        });
    }
    if (user) {
        req.session.userId = user.id.toString();
        res.send({
            user: {
                email: user.email,
                uuid: user.uuid,
                role: user.role,
                due: user.due,
            },
        });
    }
}));
router.post("/facebook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const check = yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${content.token}`);
    if (content.id !== check.data.id) {
        res.send({
            error: {
                field: "auth",
                message: "驗證失敗",
            },
        });
    }
    const user = yield prisma.user.findUnique({
        where: { email: content.email },
    });
    if (!user) {
        const uuid = uniqid_1.default.time();
        const newUser = yield prisma.user.create({
            data: {
                uuid,
                email: content.email,
                due: getDueTime_1.getDueTime(30),
            },
        });
        yield couchAddUser(uuid);
        req.session.userId = newUser.id.toString();
        res.send({
            user: {
                email: newUser.email,
                uuid: newUser.uuid,
                role: newUser.role,
                due: newUser.due,
            },
        });
        return;
    }
    req.session.userId = user.id.toString();
    res.send({
        user: {
            email: user.email,
            uuid: user.uuid,
            role: user.role,
            due: user.due,
        },
    });
}));
router.get("/valid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (user) {
            res.send({
                user: {
                    email: user.email,
                    uuid: user.uuid,
                    role: user.role,
                    due: user.due,
                },
            });
        }
        else {
            res.send(false);
        }
    }
    else {
        res.send(false);
    }
}));
router.post("/forget", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email: content.email },
    });
    if (!user) {
        res.send(true);
        return;
    }
    const token = uuid_1.v4();
    yield index_1.redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60);
    const subject = "Reset Password";
    const emailContent = `
    <p>Hi,</p>
    <p>這是重置密碼的<a href="https://tangobox.app/forget/${token}" _target="blank">連結</a></p>
    <p>https://tangobox.app/forget/${token}</p>
    <p>請在一個小時內使用。</p>
    `;
    yield sendEmail_1.default(user.email, subject, emailContent);
    res.send(true);
}));
router.post("/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    if (content.newPassword.length < 8) {
        res.send({
            error: {
                field: "newPassword",
                message: "密碼長度需至少8碼",
            },
        });
    }
    const userId = yield index_1.redis.get(constants_1.FORGOT_PASSWORD_PREFIX + content.token);
    if (!userId) {
        res.send({
            error: {
                field: "token",
                message: "連結無效",
            },
        });
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(content.newPassword, salt);
    const user = yield prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
            password: hashedPassword,
        },
    });
    if (!user) {
        res.send({
            error: {
                field: "token",
                message: "用戶不存在",
            },
        });
    }
    res.send({ user });
}));
router.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.clearCookie("tangobox").status(200).send(true);
    });
}));
router.get("/allusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId === "1") {
        const users = yield prisma.user.findMany();
        res.send(users);
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map