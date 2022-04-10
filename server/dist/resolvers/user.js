"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = exports.UserResponse = exports.Error = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const isemail_1 = __importDefault(require("isemail"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const axios_1 = __importDefault(require("axios"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
let Error = class Error {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Error.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Error.prototype, "message", void 0);
Error = __decorate([
    type_graphql_1.ObjectType()
], Error);
exports.Error = Error;
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [Error], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
exports.UserResponse = UserResponse;
let UserResolver = class UserResolver {
    me({ req, prisma, tango }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(yield tango.N5.findAll());
            if (!req.session.userId) {
                return null;
            }
            return yield prisma.user.findUnique({
                where: { id: parseInt(req.session.userId) },
            });
        });
    }
    users({ prisma }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma.user.findMany();
            return users;
        });
    }
    facebookAuth(name, email, id, token, { req, prisma }) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${token}`);
            if (id !== check.data.id) {
                return {
                    errors: [
                        {
                            field: 'auth',
                            message: '驗證失敗',
                        },
                    ],
                };
            }
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                const newUser = yield prisma.user.create({
                    data: { name, email, activated: true },
                });
                req.session.userId = newUser.id.toString();
                return { user: newUser };
            }
            req.session.userId = user.id.toString();
            return { user };
        });
    }
    googleAuth(name, email, token, { req, prisma }) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield jwt_simple_1.default.decode(token, 'secret', true);
            if (check.email !== email) {
                return {
                    errors: [
                        {
                            field: 'auth',
                            message: '驗證失敗',
                        },
                    ],
                };
            }
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                const newUser = yield prisma.user.create({
                    data: { name, email, activated: true },
                });
                req.session.userId = newUser.id.toString();
                return { user: newUser };
            }
            req.session.userId = user.id.toString();
            return { user };
        });
    }
    register(name, email, password, { prisma, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (name.length < 3) {
                return {
                    errors: [
                        {
                            field: 'name',
                            message: '使用者名稱長度需大於3',
                        },
                    ],
                };
            }
            if (password.length < 8) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: '密碼長度需至少8碼',
                        },
                    ],
                };
            }
            if (!isemail_1.default.validate(email)) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: '請輸入正確的email',
                        },
                    ],
                };
            }
            if (yield prisma.user.findFirst({ where: { email } })) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: '該Email已被使用',
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            const user = yield prisma.user.create({
                data: { name, email, password: hashedPassword },
            });
            const token = uuid_1.v4();
            yield redis.set(constants_1.ACTIVATE_PREFIX + token, user.id, 'ex', 1000 * 60 * 60);
            const subject = 'Email Authentication';
            const content = `
    <p>Hi, ${user.name}</p>
    <p>這是啟用帳號的<a href="http://localhost:3000/activate/${token}" _target="blank">連結</a></p>
    <p>http://localhost:3000/activate/${token}</p>
    <p>請在一個小時內使用。</p>
    `;
            yield sendEmail_1.default(email, subject, content);
            return {
                user,
            };
        });
    }
    login(email, password, { req, prisma }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user || !user.password) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: '登入失敗，請確認Email或密碼',
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: '登入失敗，請確認Email或密碼',
                        },
                    ],
                };
            }
            req.session.userId = user.id.toString();
            return { user };
        });
    }
    forgotPassword(email, { prisma, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            yield redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60);
            const subject = 'Reset Password';
            const content = `
    <p>Hi, ${user.name}</p>
    <p>這是重置密碼的<a href="http://localhost:3000/forget/${token}" _target="blank">連結</a></p>
    <p>http://localhost:3000/forget/${token}</p>
    <p>請在一個小時內使用。</p>
    `;
            yield sendEmail_1.default(email, subject, content);
            return true;
        });
    }
    changePassword(token, newPassword, { prisma, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length < 8) {
                return {
                    errors: [
                        {
                            field: 'newPassword',
                            message: '密碼長度需至少8碼',
                        },
                    ],
                };
            }
            const userId = yield redis.get(constants_1.FORGOT_PASSWORD_PREFIX + token);
            if (!userId) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: '連結無效',
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(newPassword);
            const user = yield prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    password: hashedPassword,
                },
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: '用戶不存在',
                        },
                    ],
                };
            }
            return { user };
        });
    }
    resendActivate(email, { redis, prisma }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: '用戶不存在',
                        },
                    ],
                };
            }
            const token = uuid_1.v4();
            yield redis.set(constants_1.ACTIVATE_PREFIX + token, user.id, 'ex', 1000 * 60 * 60);
            const subject = 'Email Authentication';
            const content = `
    <p>Hi, ${user.name}</p>
    <p>這是啟用帳號的<a href="http://localhost:3000/activate/${token}" _target="blank">連結</a></p>
    <p>http://localhost:3000/activate/${token}</p>
    <p>請在一個小時內使用。</p>
    `;
            yield sendEmail_1.default(email, subject, content);
            return {
                user,
            };
        });
    }
    activate(token, { req, prisma, redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield redis.get(constants_1.ACTIVATE_PREFIX + token);
            if (!userId) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: '連結無效或已使用',
                        },
                    ],
                };
            }
            const user = yield prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    activated: true,
                },
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: '用戶不存在',
                        },
                    ],
                };
            }
            yield redis.del(constants_1.ACTIVATE_PREFIX + token);
            req.session.userId = user.id.toString();
            return { user };
        });
    }
    logout({ req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                req.session.destroy((err) => {
                    res.clearCookie(constants_1.COOKIE_NAME);
                    if (err) {
                        console.log(err);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        });
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('email')),
    __param(2, type_graphql_1.Arg('id')),
    __param(3, type_graphql_1.Arg('token')),
    __param(4, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "facebookAuth", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('email')),
    __param(2, type_graphql_1.Arg('token')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "googleAuth", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('email')),
    __param(2, type_graphql_1.Arg('password')),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Arg('newPassword')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resendActivate", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "activate", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map