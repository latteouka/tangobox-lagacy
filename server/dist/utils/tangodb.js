"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tango = exports.db = void 0;
const sequelize_1 = require("sequelize");
exports.db = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './tango.sqlite',
});
exports.tango = exports.db.define('tango', {
    tango: sequelize_1.DataTypes.STRING,
    meaning: sequelize_1.DataTypes.STRING,
    sentence: sequelize_1.DataTypes.STRING,
}, {
    freezeTableName: true,
    timestamps: false,
});
//# sourceMappingURL=tangodb.js.map