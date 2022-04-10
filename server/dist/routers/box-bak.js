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
router.post('/addbox5', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
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
                active5: 'gojyu',
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew5: updatedUser.dailyNew5,
                dailyNewT: updatedUser.dailyNewT,
                dailyNewG: updatedUser.dailyNewG,
                active5: updatedUser.active5,
                activeT: updatedUser.activeT,
                activeG: updatedUser.activeG,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
router.post('/addboxT', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                activeT: content.cat,
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew5: updatedUser.dailyNew5,
                dailyNewT: updatedUser.dailyNewT,
                dailyNewG: updatedUser.dailyNewG,
                active5: updatedUser.active5,
                activeT: updatedUser.activeT,
                activeG: updatedUser.activeG,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
router.post('/addboxG', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                activeG: content.cat,
            },
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew5: updatedUser.dailyNew5,
                dailyNewT: updatedUser.dailyNewT,
                dailyNewG: updatedUser.dailyNewG,
                active5: updatedUser.active5,
                activeT: updatedUser.activeT,
                activeG: updatedUser.activeG,
                role: updatedUser.role,
                due: updatedUser.due,
            },
        });
    }
    else {
        res.send(false);
    }
}));
router.post('/deletebox', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const { content } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        let data = {};
        if (content.box === 'gojyu') {
            data = { active5: null };
        }
        else if (content.box === 'n1' ||
            content.box === 'n2' ||
            content.box === 'n3' ||
            content.box === 'n4' ||
            content.box === 'n5') {
            data = { activeT: null };
        }
        else if (content.box === 'grammer') {
            data = { activeG: null };
        }
        if (!user) {
            res.send(false);
        }
        const updatedUser = yield prisma.user.update({
            where: {
                id: parseInt(req.session.userId),
            },
            data,
        });
        res.send({
            user: {
                email: updatedUser.email,
                uuid: updatedUser.uuid,
                dailyNew5: updatedUser.dailyNew5,
                dailyNewT: updatedUser.dailyNewT,
                dailyNewG: updatedUser.dailyNewG,
                active5: updatedUser.active5,
                activeT: updatedUser.activeT,
                activeG: updatedUser.activeG,
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
//# sourceMappingURL=box-bak.js.map