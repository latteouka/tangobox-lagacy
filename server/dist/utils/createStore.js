"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const config = {
    client: 'sqlite3',
    connection: {
        filename: '../../data.db',
    },
};
const knexInstance = knex_1.knex(config);
try {
    const users = await knex_1.knex('users').select('id', 'age');
}
catch (err) {
}
//# sourceMappingURL=createStore.js.map