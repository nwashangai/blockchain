import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import request from "request-promise";
import BlockChain from "./BlockChain";
import auth from "./helpers/auth";
import Transaction from "./Transaction";

dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

const teraCoin = new BlockChain(process.argv[2]);

app.get("/", (req, res) => {
  res.send("Blockchain technology (TeraCoin)");
});

app.get("/blockchain", (req, res) => {
  res.status(200).json(teraCoin.getChain());
});

app.post("/register-node-bulk", (req, res) => {
  try {
    const { blockchain } = req.body;
    if (blockchain.networkNodes) {
      teraCoin.setActiveNodeList(blockchain.networkNodes);
      teraCoin.replaceBlockWithLatest(
        blockchain.chain,
        blockchain.pendingTransactions
      );
    }
    res.status(200).send("bulk nodes registered successfully");
  } catch (error) {
    res.status(401).send({
      message: error.message,
      status: "error"
    });
  }
});

app.post("/register-and-broadcast-node", (req, res) => {
  try {
    const { nodeUrl } = req.body;
    const promises = [];
    teraCoin.registerNode(nodeUrl);
    teraCoin.getActiveNodeList().forEach(url => {
      const requestOption = {
        body: { nodeUrl },
        json: true,
        method: "POST",
        uri: `${url}/register-node`
      };
      promises.push(request(requestOption));
    });
    Promise.all(promises)
      .then(_ => {
        const bulkRegisterOption = {
          body: {
            blockchain: teraCoin.getChain()
          },
          json: true,
          method: "POST",
          uri: `${nodeUrl}/register-node-bulk`
        };
        return request(bulkRegisterOption);
      })
      .then(_ => {
        res.status(200).send("new nodes registered successfully");
      })
      .catch(error =>
        res.status(500).send({
          message: error.message,
          status: "error"
        })
      );
  } catch (error) {
    res.status(401).send({
      message: error.message,
      status: "error"
    });
  }
});

app.post("/register-node", (req, res) => {
  try {
    if (req.body.nodeUrl) {
      teraCoin.registerNode(req.body.nodeUrl);
    }
    res.status(200).send("successful");
  } catch (error) {
    res.status(401).send({
      message: error.message,
      status: "error"
    });
  }
});

app.get("/transactions/:address", (req, res) => {
  const transactions = teraCoin.getTransactions(req.params.address);
  res.status(200).json({ data: transactions });
});

app.get("/mine", (req, res) => {
  try {
    teraCoin.minePendingTransactions(process.env.MINER_ADDRESS);
    res.status(200).json({ message: "mine successfull" });
  } catch (error) {
    res.status(401).send({
      message: "Please make sure to provide an address",
      status: "error"
    });
  }
});

app.post("/transaction", auth, (req, res) => {
  try {
    const { sender, recipient, payload, amount, signature } = req.body;
    const balance = teraCoin.getBalance(sender);
    const promises = [];
    if (balance < (amount || 0)) {
      throw new Error("you don't have enough coin to make this transaction");
    }
    const transaction = new Transaction({ sender, recipient, amount, payload });
    transaction.signTransaction(signature);
    teraCoin.addTransaction(transaction);
    teraCoin.getActiveNodeList().forEach(url => {
      if (url !== teraCoin.getCurrentNodeURL) {
        const requestOption = {
          body: { transaction },
          json: true,
          method: "POST",
          uri: `${url}/broadcast-transaction`
        };
        promises.push(request(requestOption));
      }
    });
    Promise.all(promises)
      .then(_ => {
        res.status(200).json(transaction);
      })
      .catch(error =>
        res.status(500).send({
          message: error.message,
          status: "error2"
        })
      );
  } catch (error) {
    res.status(401).send({ status: "error1", message: error.message });
  }
});

app.post("/broadcast-transaction", (req, res) => {
  try {
    const { transaction } = req.body;
    teraCoin.addTransaction(new Transaction(transaction));
    res.status(200).json({ message: "successful" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.get("/balance", auth, (req, res) => {
  try {
    const { signature } = req.body;
    const balance = teraCoin.getBalance(signature.getPublic("hex"));
    res.status(200).json({ balance });
  } catch (error) {
    res.status(401).send({
      message: error.message,
      status: "error"
    });
  }
});

app.listen(process.env.PORT || 3032, () => {
  console.log(process.argv[2]);
  console.log(`Blockchain running on port ${process.env.PORT || 3032}...`);
});
