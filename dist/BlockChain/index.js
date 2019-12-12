"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __importDefault(require("../Block"));
const Transaction_1 = __importDefault(require("../Transaction"));
class BlockChain {
    constructor() {
        this.difficulty = 2;
        this.chain = [this.createGenisisBlock()];
        this.pendingTransactions = [];
        this.miningReward = 10;
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addTransaction(transaction) {
        if (transaction.type === "sending" &&
            (!transaction.sender || !transaction.recipient)) {
            throw new Error("Block must include from and to address");
        }
        else if (!transaction.isValid()) {
            throw new Error("Cannot add invalid block to chain");
        }
        this.pendingTransactions.push(transaction);
    }
    getKey(user, password) {
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.type === "create") {
                    if (transaction.data.user === user &&
                        transaction.data.password === password) {
                        return transaction.key;
                    }
                }
            }
        }
        throw new Error("email or password is incorrect");
    }
    getChain() {
        return this.chain;
    }
    getBalance(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.type === "deposit" || transaction.type === "mine") {
                    balance +=
                        transaction.recipient === address
                            ? transaction.amount
                            : transaction.sender === address
                                ? -transaction.amount
                                : balance;
                }
            }
        }
        return balance;
    }
    minePendingTransactions(minerRewardAddress) {
        const newBlock = new Block_1.default(new Date().toUTCString(), this.pendingTransactions, this.getLatestBlock().hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.pendingTransactions = [
            new Transaction_1.default({
                amount: this.miningReward,
                recipient: minerRewardAddress,
                type: "mine"
            })
        ];
    }
    isBlockChainVailid() {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            if (currentBlock.calculateHash() !== currentBlock.hash) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    createGenisisBlock() {
        return new Block_1.default(new Date().toUTCString(), [
            new Transaction_1.default({
                type: "genesis"
            })
        ], "");
    }
}
exports.default = BlockChain;
//# sourceMappingURL=index.js.map