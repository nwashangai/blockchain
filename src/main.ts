import Elliptic from "elliptic";
import express from "express";
import logger from "morgan";
import BlockChain from "./BlockChain";
import Transaction from "./Transaction";

const ec = new Elliptic.ec("secp256k1");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.get("/", (req, res) => {
  res.send("Blockchain technology");
});

app.listen(3032, () => {
  const bisCoin = new BlockChain();

  const key1 = ec.genKeyPair();
  bisCoin.addTransaction(
    new Transaction({
      data: { user: "nwashangai@gmail.com", password: "123456" },
      key: {
        private: key1.getPrivate("hex"),
        public: key1.getPublic("hex")
      },
      type: "create"
    })
  );
  const key2 = ec.genKeyPair();
  bisCoin.addTransaction(
    new Transaction({
      data: { user: "john@gmail.com", password: "123456" },
      key: {
        private: key2.getPrivate("hex"),
        public: key2.getPublic("hex")
      },
      type: "create"
    })
  );

  bisCoin.minePendingTransactions("***");

  const sender = bisCoin.getKey("nwashangai@gmail.com", "123456");
  const receiver = bisCoin.getKey("john@gmail.com", "123456");

  const signature = ec.keyFromPrivate(sender.private);
  const tx1 = new Transaction({
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
