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
const lodash_1 = __importDefault(require("lodash"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const generateDefault = (userId) => {
    const data = [];
    for (let i = 1; i < 670; i++) {
        data.push({ userId, number: i });
    }
    return data;
};
router.post('/updateCard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
        }
        const record = yield prisma.recordn5.update({
            where: { number: req.body.number },
            data: {
                new: false,
                due: req.body.due,
                level: req.body.level,
            },
        });
        if (record) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    }
}));
router.post('/getCards', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
        }
        const allNewCards = yield prisma.recordn5.findMany({
            where: { userId: parseInt(req.session.userId), new: true },
        });
        if (allNewCards.length === 0) {
            yield prisma.recordn5.createMany({
                data: generateDefault(parseInt(req.session.userId)),
            });
            const allRecords = yield prisma.recordn5.findMany({
                where: { userId: parseInt(req.session.userId) },
                orderBy: { number: 'asc' },
            });
            const random = lodash_1.default.shuffle(allRecords);
            const newCards = random.slice(0, parseInt(req.body.dailyNew));
            res.send({ newCards, reviewCards: [] });
            return;
        }
        const reviewCards = yield prisma.recordn5.findMany({
            where: {
                userId: parseInt(req.session.userId),
                new: false,
                due: { lt: new Date() },
            },
        });
        const newCards = allNewCards.slice(0, parseInt(req.body.dailyNew));
        res.send({ newCards, reviewCards });
    }
    else {
        res.send(false);
    }
}));
router.get('/statics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
            return;
        }
        const allNewCards = yield prisma.recordn5.findMany({
            where: { userId: user.id, new: true },
        });
        const reviewCards = yield prisma.recordn5.findMany({
            where: {
                userId: user.id,
                new: false,
            },
        });
        const graduates = yield prisma.recordn5.findMany({
            where: {
                userId: user.id,
                due: { gt: new Date(new Date().setDate(new Date().getDate() + 30)) },
            },
        });
        res.send({
            new: allNewCards.length,
            review: reviewCards.length,
            graduate: graduates.length,
        });
    }
    else {
        res.send(false);
    }
}));
router.get('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
            return;
        }
        yield prisma.recordn5.deleteMany({
            where: {
                userId: user.id,
            },
        });
        res.send(true);
    }
    else {
        res.send(false);
    }
}));
exports.default = router;
//# sourceMappingURL=tango5.js.map