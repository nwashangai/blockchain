const express = require("express");
const logger = require("morgan");
const BlockChain = require("./BlockChain");
const Elliptic = require("elliptic").ec;
const ec = new Elliptic("secp256k1");
const Transaction = require("./Transaction");

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
      type: "create",
      key: {
        private: key1.getPrivate("hex"),
        public: key1.getPublic("hex")
      },
      data: { user: "nwashangai@gmail.com", password: "123456" }
    })
  );
  const key2 = ec.genKeyPair();
  bisCoin.addTransaction(
    new Transaction({
      type: "create",
      key: {
        private: key2.getPrivate("hex"),
        public: key2.getPublic("hex")
      },
      data: { user: "john@gmail.com", password: "123456" }
    })
  );

  bisCoin.minePendingTransactions("***");

  const sender = bisCoin.getKey("nwashangai@gmail.com", "123456");
  const receiver = bisCoin.getKey("john@gmail.com", "123456");

  const signature = ec.keyFromPrivate(sender.private);
  const tx1 = new Transaction({
    type: "deposit",
    sender: sender.public,
    recipient: receiver.public,
    amount: 10
  });
  tx1.signTransaction(signature);
  bisCoin.addTransaction(tx1);

  bisCoin.minePendingTransactions("***");
  console.log("my balance is ", bisCoin.getBalance(receiver.public));
  bisCoin.minePendingTransactions("***");

  console.log("my new balance is ", bisCoin.getBalance("***"));

  console.log(JSON.stringify(bisCoin.chain, null, 4));
});
