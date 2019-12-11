const Block = require("./Block");
const Transaction = require("./Transaction");

class BlockChain {
  constructor() {
    this.difficulty = 4;
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

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;
    for (let block of this.chain) {
      for (let transaction of block.transactions) {
        balance +=
          transaction.toAddress === address
            ? transaction.amount
            : transaction.fromAddress === address
            ? -transaction.amount
            : balance;
      }
    }
    return balance;
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }

  minePendingTransactions(minerRewardAddress) {
    let newBlock = new Block(
      new Date().toUTCString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.pendingTransactions = [
      new Transaction(null, minerRewardAddress, this.miningReward)
    ];
  }

  isBlockChainVailid() {
    for (let index = 1; index < this.chain.length; index++) {
      let currentBlock = this.chain[index];
      let previousBlock = this.chain[index - 1];
      if (currentBlock.calculateHash() !== currentBlock.hash) return false;
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }
}

module.exports = BlockChain;
