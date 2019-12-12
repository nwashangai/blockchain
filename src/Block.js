const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    (this.timestamp = timestamp),
      (this.transactions = transactions),
      (this.nonce = 0),
      (this.previousHash = previousHash),
      (this.hash = this.calculateHash());
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        this.previousHash +
        this.nonce +
        JSON.stringify(this.transactions)
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) return false;
    }
    return true;
  }
}

module.exports = Block;
