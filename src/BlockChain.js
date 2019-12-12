const Block = require("./Block");
const Transaction = require("./Transaction");

class BlockChain {
  constructor() {
    this.difficulty = 2;
    this.chain = [this.createGenisisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  createGenisisBlock() {
    return new Block(new Date().toUTCString(), "Genesis Block", "");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (
      transaction.type === "sending" &&
      (!transaction.sender || !transaction.recipient)
    ) {
      throw new Error("Block must include from and to address");
    } else if (!transaction.isValid()) {
      throw new Error("Cannot add invalid block to chain");
    }
    this.pendingTransactions.push(transaction);
  }

  getKey(user, password) {
    for (let block of this.chain) {
      for (let transaction of block.transactions) {
        if (transaction.type === "create") {
          if (
            transaction.data.user === user &&
            transaction.data.password === password
          ) {
            return transaction.key;
          }
        }
      }
    }
    throw new Error("email or password is incorrect");
  }

  getBalance(address) {
    let balance = 0;
    for (let block of this.chain) {
      for (let transaction of block.transactions) {
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
    let newBlock = new Block(
      new Date().toUTCString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.pendingTransactions = [
      new Transaction({
        type: "mine",
        recipient: minerRewardAddress,
        amount: this.miningReward
      })
    ];
  }

  isBlockChainVailid() {
    for (let index = 1; index < this.chain.length; index++) {
      let currentBlock = this.chain[index];
      let previousBlock = this.chain[index - 1];
      if (!currentBlock.hasValidTransactions()) return false;
      if (currentBlock.calculateHash() !== currentBlock.hash) return false;
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }
}

module.exports = BlockChain;
