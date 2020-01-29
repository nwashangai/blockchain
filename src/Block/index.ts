import SHA256 from "crypto-js/sha256";

// interface
import Transaction from "../Transaction";
import { TransactionInterface } from "../Transaction/interface";
import { BlockBuilder, BlockInterface } from "./interface";

class Block implements BlockInterface {
  public static builder(block: BlockBuilder) {
    const { timestamp, transactions, previousHash, proofOfWork } = block;
    return new Block(timestamp, transactions, previousHash, proofOfWork);
  }

  private timestamp;
  private proofOfWork;
  private previousHash;
  private hash;
  private transactions;

  constructor(
    timestamp: string,
    transactions: TransactionInterface[],
    previousHash?: string,
    proofOfWork?: number
  ) {
    (this.timestamp = timestamp),
      (this.transactions = transactions),
      (this.proofOfWork = proofOfWork || 0),
      (this.previousHash = previousHash),
      (this.hash = this.calculateHash());
  }

  public mineBlock = difficulty => {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.proofOfWork++;
      this.hash = this.calculateHash();
    }
  };

  public isBlockValid = chain => {
    for (const tx of this.transactions) {
      if (!Transaction.builder(tx).isValid() || !this.isBlockLinked(chain)) {
        return false;
      }
    }
    return true;
  };

  private isBlockLinked = chain => {
    return chain[chain.length - 1].hash === this.previousHash;
  };

  private calculateHash() {
    return SHA256(
      this.timestamp +
        this.previousHash +
        this.proofOfWork +
        JSON.stringify(this.transactions)
    ).toString();
  }
}

export default Block;
