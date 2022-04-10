"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChecksum = void 0;
const urlencode_1 = __importDefault(require("urlencode"));
const crypto_1 = __importDefault(require("crypto"));
const generateChecksum = (params) => {
    const hash = '5294y06JbISpM5x9';
    const hashiv = 'v77hoKGq4kWxNNIS';
    let od = {};
    let temp_arr = Object.keys(params).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    let raw = temp_arr.forEach(function (key) {
        od[key] = params[key];
    });
    raw = JSON.stringify(od).toLowerCase().replace(/":"/g, '=');
    raw = raw.replace(/","|{"|"}/g, '&');
    raw = urlencode_1.default(`HashKey=${hash}${raw}HashIV=${hashiv}`).toLowerCase();
    console.log(raw);
    let encoded = raw.replace(/\'/g, '%27');
    encoded = encoded.replace(/\~/g, '%7e');
    encoded = encoded.replace(/\%20/g, '+');
    const chksum = crypto_1.default.createHash('sha256').update(encoded).digest('hex');
    console.log(chksum.toUpperCase());
    return chksum.toUpperCase();
};
exports.generateChecksum = generateChecksum;
//# sourceMappingURL=generateChecksum.js.map