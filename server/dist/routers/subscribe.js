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
const ecpay_aio_nodejs_1 = __importDefault(require("ecpay_aio_nodejs"));
const axios_1 = __importDefault(require("axios"));
const unix_timestamp_1 = __importDefault(require("unix-timestamp"));
const qs_1 = __importDefault(require("qs"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
function getTimeString(time) {
    return (time.getFullYear() +
        '/' +
        `${time.getMonth() + 1}`.padStart(2, '0') +
        '/' +
        `${time.getDate()}`.padStart(2, '0') +
        ' ' +
        ('0' + time.getHours()).slice(-2) +
        ':' +
        ('0' + time.getMinutes()).slice(-2) +
        ':' +
        ('0' + time.getSeconds()).slice(-2));
}
router.use(express_1.default.urlencoded({ extended: true }));
router.get('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
            return;
        }
        const subId = uniqid_1.default('tbid');
        const timeNow = new Date();
        const timeString = getTimeString(timeNow);
        yield prisma.trade.create({
            data: { userId: parseInt(req.session.userId), subId },
        });
        let baseParams = {
            MerchantID: '3261765',
            MerchantTradeNo: subId,
            MerchantTradeDate: timeString,
            PaymentType: 'aio',
            TotalAmount: '60',
            TradeDesc: 'TangoBox訂閱',
            ItemName: 'TangoBox訂閱',
            ReturnURL: 'https://api.tangobox.app/subscribe/finish',
            ChoosePayment: 'Credit',
            ClientBackURL: 'https://tangobox.app/settings',
            EncryptType: '1',
        };
        const invParams = {};
        const periodParams = {
            PeriodAmount: '60',
            PeriodType: 'M',
            Frequency: '1',
            ExecTimes: '12',
            PeriodReturnURL: 'https://api.tangobox.app/subscribe/period',
        };
        const options = {
            OperationMode: 'Production',
            MercProfile: {
                MerchantID: '3261765',
                HashKey: 'hnjoBsBpazpuMOG2',
                HashIV: 'm4CbzmMGcdqQi8Ku',
            },
            IgnorePayment: ['WebATM', 'ATM', 'CVS', 'BARCODE', 'AndroidPay'],
            IsProjectContractor: false,
        };
        const transaction = new ecpay_aio_nodejs_1.default(options);
        const html = transaction.payment_client.aio_check_out_credit_period(periodParams, baseParams, invParams);
        res.send(html);
    }
    else {
        res.send(false);
        return;
    }
}));
router.post('/period', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    const options = {
        OperationMode: 'Production',
        MercProfile: {
            MerchantID: '3261765',
            HashKey: 'hnjoBsBpazpuMOG2',
            HashIV: 'm4CbzmMGcdqQi8Ku',
        },
    };
    const transaction = new ecpay_aio_nodejs_1.default(options);
    const bodyChecksum = body['CheckMacValue'];
    delete body['CheckMacValue'];
    const check = transaction.payment_client.helper.gen_chk_mac_value(body);
    const valid = check === bodyChecksum;
    console.log(valid);
    if (!valid) {
        res.send('sorry');
        return;
    }
    console.log('valid');
    const record = yield prisma.trade.findFirst({
        where: { subId: body.MerchantTradeNo },
    });
    const subrecord = yield prisma.subrecord.create({
        data: {
            userId: record.userId,
            subId: body.MerchantTradeNo,
            rtncode: parseInt(body.RtnCode),
            rtnmsg: body.RtnMsg,
            periodType: body.PeriodType,
            frequency: parseInt(body.Frequency),
            execTimes: parseInt(body.ExecTimes),
            amount: parseInt(body.Amount),
            gwsr: parseInt(body.Gwsr),
            time: body.ProcessDate,
            authcode: body.AuthCode,
            firstAmount: parseInt(body.FirstAuthAmount),
            totalTimes: parseInt(body.TotalSuccessTimes),
        },
    });
    console.log(subrecord);
    if (!subrecord) {
        res.send('no record');
    }
    if (subrecord.rtncode === 1) {
        yield prisma.user.update({
            where: { id: subrecord.userId },
            data: {
                role: 1,
                due: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });
    }
    res.send('1|OK');
}));
router.post('/finish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    const options = {
        OperationMode: 'Production',
        MercProfile: {
            MerchantID: '3261765',
            HashKey: 'hnjoBsBpazpuMOG2',
            HashIV: 'm4CbzmMGcdqQi8Ku',
        },
    };
    const transaction = new ecpay_aio_nodejs_1.default(options);
    const bodyChecksum = body['CheckMacValue'];
    delete body['CheckMacValue'];
    const check = transaction.payment_client.helper.gen_chk_mac_value(body);
    const valid = check === bodyChecksum;
    console.log(valid);
    if (!valid) {
        res.send('sorry');
        return;
    }
    console.log('valid');
    const record = yield prisma.trade.update({
        where: { subId: body.MerchantTradeNo },
        data: {
            rtncode: parseInt(body.RtnCode),
            rtnmsg: body.RtnMsg,
            tradeNo: body.TradeNo,
            tradeamt: parseInt(body.TradeAmt),
            paymentDate: body.PaymentDate,
            paymentType: body.PaymentType,
            tradeDate: body.TradeDate,
        },
    });
    console.log(record);
    if (!record) {
        res.send('no record');
    }
    if (record.rtncode === 1) {
        yield prisma.user.update({
            where: { id: record.userId },
            data: {
                role: 1,
                due: new Date(new Date().setDate(new Date().getDate() + 30)),
            },
        });
    }
    res.send('1|OK');
}));
router.get('/stop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.userId) {
        const user = yield prisma.user.findUnique({
            where: { id: parseInt(req.session.userId) },
        });
        if (!user) {
            res.send(false);
            return;
        }
        const trade = yield prisma.trade.findMany({
            where: { userId: parseInt(req.session.userId), rtncode: 1 },
            orderBy: { id: 'desc' },
        });
        if (trade.length === 0) {
            res.send(false);
            return;
        }
        const options = {
            OperationMode: 'Production',
            MercProfile: {
                MerchantID: '3261765',
                HashKey: 'hnjoBsBpazpuMOG2',
                HashIV: 'm4CbzmMGcdqQi8Ku',
            },
        };
        const stopParams = {
            Action: 'Cancel',
            MerchantID: '3261765',
            MerchantTradeNo: trade[0].subId,
            TimeStamp: parseInt(unix_timestamp_1.default.now()).toString(),
        };
        const transaction = new ecpay_aio_nodejs_1.default(options);
        const checksum = transaction.payment_client.helper.gen_chk_mac_value(stopParams);
        stopParams['CheckMacValue'] = checksum;
        const query = qs_1.default.stringify(stopParams);
        const response = yield axios_1.default.post('https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction', query, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response);
        const result = qs_1.default.parse(response.data);
        console.log(result);
        if (result.RtnCode === '1') {
            const updateUser = yield prisma.user.update({
                where: { id: user.id },
                data: {
                    role: 0,
                },
            });
            res.send({ user: updateUser });
        }
        else {
            res.send(false);
        }
    }
    else {
        res.send(false);
    }
}));
router.get('/allrecord', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield prisma.trade.findMany();
    res.send(records);
}));
router.get('/allsubrecord', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield prisma.subrecord.findMany();
    res.send(records);
}));
exports.default = router;
//# sourceMappingURL=subscribe.js.map