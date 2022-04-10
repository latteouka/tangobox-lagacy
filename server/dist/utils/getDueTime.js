"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDueTime = void 0;
const getDueTime = (days) => {
    const dueDate = new Date(new Date().setDate(new Date().getDate() + days));
    return dueDate;
};
exports.getDueTime = getDueTime;
//# sourceMappingURL=getDueTime.js.map