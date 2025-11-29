"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignInSchema = zod_1.default.object({
    email: zod_1.default.string().min(1, "Email is required").email("Enter a valid email"),
    password: zod_1.default.string().min(1, "Password is required").min(6, "Min 6 characters"),
    remember: zod_1.default.boolean().default(false),
});
