import SHA256 from "crypto-js/sha256";

// interface
import { TransactionInterface } from "../Transaction/interface";
import { BlockInterface } from "./interface";

class Block implements BlockInterface {
  private timestamp;
  private nonce;
  private previousHash;
  private hash;
  private transactions;

  constructor(
    timestamp: string,
    transactions: TransactionInterface[],
    previousHash?: string
  ) {
    (this.timestamp = timestamp),
      (this.transactions = transactions),
      (this.nonce = 0),
      (this.previousHash = previousHash),
      (this.hash = this.calculateHash());
  }

  public mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }

  public hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }

  private calculateHash() {
    return SHA256(
      this.timestamp +
        this.previousHash +
        this.nonce +
        JSON.stringify(this.transactions)
    ).toString();
  }
}

export default Block;
