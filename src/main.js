const express = require("express");
const logger = require("morgan");
const BlockChain = require("./BlockChain");
const Block = require("./Block");
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

  bisCoin.createTransaction(new Transaction("xxx", "xxxx", 3));
  bisCoin.createTransaction(new Transaction("xxx1", "xxxx1", 1));
  bisCoin.createTransaction(new Transaction("xxx2", "xxxx2", 4));

  console.log("Starting mining..");
  bisCoin.minePendingTransactions("xvd");
  console.log("my balance is ", bisCoin.getBalance("xvd"));
  bisCoin.minePendingTransactions("xvd");

  console.log("my new balance is ", bisCoin.getBalance("xvd"));
  // console.log("isChain valid?", bisCoin.isBlockChainVailid());
  // bisCoin.chain[2].payload.amount = 7;
  // bisCoin.chain[2].calculateHash();
  // console.log(bisCoin.isBlockChainVailid());

  // console.log(JSON.stringify(bisCoin, null, 4));
});
