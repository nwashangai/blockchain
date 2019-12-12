"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const elliptic_1 = __importDefault(require("elliptic"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const BlockChain_1 = __importDefault(require("./BlockChain"));
const Transaction_1 = __importDefault(require("./Transaction"));
const ec = new elliptic_1.default.ec("secp256k1");
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: false
}));
app.get("/", (req, res) => {
    res.send("Blockchain technology");
});
app.listen(3032, () => {
    const bisCoin = new BlockChain_1.default();
    const key1 = ec.genKeyPair();
    bisCoin.addTransaction(new Transaction_1.default({
        data: { user: "nwashangai@gmail.com", password: "123456" },
        key: {
            private: key1.getPrivate("hex"),
            public: key1.getPublic("hex")
        },
        type: "create"
    }));
    const key2 = ec.genKeyPair();
    bisCoin.addTransaction(new Transaction_1.default({
        data: { user: "john@gmail.com", password: "123456" },
        key: {
            private: key2.getPrivate("hex"),
            public: key2.getPublic("hex")
        },
        type: "create"
    }));
    bisCoin.minePendingTransactions("***");
    const sender = bisCoin.getKey("nwashangai@gmail.com", "123456");
    const receiver = bisCoin.getKey("john@gmail.com", "123456");
    const signature = ec.keyFromPrivate(sender.private);
    const tx1 = new Transaction_1.default({
        amount: 10,
        recipient: receiver.public,
        sender: sender.public,
        type: "deposit"
    });
    tx1.signTransaction(signature);
    bisCoin.addTransaction(tx1);
    bisCoin.minePendingTransactions("***");
    console.log("my balance is ", bisCoin.getBalance(receiver.public));
    bisCoin.minePendingTransactions("***");
    console.log("is Block Valid ?", bisCoin.isBlockChainVailid());
    console.log(JSON.stringify(bisCoin.getChain(), null, 4));
});
//# sourceMappingURL=main.js.map