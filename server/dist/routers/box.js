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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/addbox50h', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const { content } = req.body;
        let newCard = 0;
        if (content.cat === '休閒') {
            newCard = 3;
        }
        else if (content.cat === '普通') {
            newCard = 5;
        }
        else if (content.cat === '激進') {
            newCard = 10;
        }
        else {
            newCard = 5;
        }
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id: parseInt(req.session.userId),
            },
            data: {
                active: [...user.active, '五十音 平假名'],
                dailyNew50h: newCard,
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew: updatedUser.dailyNew,
                dailyNew50h: updatedUser.dailyNew50h,
                dailyNew50k: updatedUser.dailyNew50k,
                active: updatedUser.active,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
router.post('/addbox50k', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const { content } = req.body;
        let newCard = 0;
        if (content.cat === '休閒') {
            newCard = 3;
        }
        else if (content.cat === '普通') {
            newCard = 5;
        }
        else if (content.cat === '激進') {
            newCard = 10;
        }
        else {
            newCard = 5;
        }
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id: parseInt(req.session.userId),
            },
            data: {
                active: [...user.active, '五十音 片假名'],
                dailyNew50k: newCard,
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew: updatedUser.dailyNew,
                dailyNew50h: updatedUser.dailyNew50h,
                dailyNew50k: updatedUser.dailyNew50k,
                active: updatedUser.active,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
router.post('/addbox', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const { content } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id: parseInt(req.session.userId),
            },
            data: {
                active: [...user.active, content.cat],
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew: updatedUser.dailyNew,
                dailyNew50h: updatedUser.dailyNew50h,
                dailyNew50k: updatedUser.dailyNew50k,
                active: updatedUser.active,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
exports.default = router;
//# sourceMappingURL=box.js.map