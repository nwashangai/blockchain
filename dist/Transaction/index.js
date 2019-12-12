"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const elliptic_1 = __importDefault(require("elliptic"));
const ec = new elliptic_1.default.ec("secp256k1");
class Transaction {
    constructor({ type, sender = null, recipient = null, amount = null, key = null, data = null }) {
        this.sender = null;
        this.recipient = null;
        this.amount = null;
        this.key = null;
        this.data = null;
        (this.type = type),
            (this.data = data),
            (this.amount = amount),
            (this.recipient = recipient),
            (this.key = key),
            (this.sender = sender);
    }
    calculateHash() {
        return sha256_1.default(this.type +
            this.sender +
            this.recipient +
            this.amount +
            this.key +
            this.data).toString();
    }
    signTransaction(signingKey) {
        if (signingKey.getPublic("hex") !== this.sender) {
            throw new Error("You cannot sign transction that doesn't belong to you");
        }
        const hashTX = this.calculateHash();
        const sign = signingKey.sign(hashTX, "base64");
        this.signature = sign.toDER("hex");
    }
    isValid() {
        if ((this.type === "mine" && this.sender === null) ||
            this.type === "create") {
            return true;
        }
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature to this transaction");
        }
        const publicKey = ec.keyFromPublic(this.sender, "hex");
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
exports.default = Transaction;
//# sourceMappingURL=index.js.map