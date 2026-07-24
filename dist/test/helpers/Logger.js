"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const roarr_1 = __importDefault(require("roarr"));
exports.Logger = roarr_1.default.child({
    connectionId: '1',
    poolId: '1',
});
//# sourceMappingURL=Logger.js.map