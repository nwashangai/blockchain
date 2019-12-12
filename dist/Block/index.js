"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
class Block {
    constructor(timestamp, transactions, previousHash) {
        (this.timestamp = timestamp),
            (this.transactions = transactions),
            (this.nonce = 0),
            (this.previousHash = previousHash),
            (this.hash = this.calculateHash());
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
    calculateHash() {
        return sha256_1.default(this.timestamp +
            this.previousHash +
            this.nonce +
            JSON.stringify(this.transactions)).toString();
    }
}
exports.default = Block;
//# sourceMappingURL=index.js.map