import Block from "../Block";
import Transaction from "../Transaction";

// interface
import { BlockChainInterface } from "./interface";

class BlockChain implements BlockChainInterface {
  private difficulty = 2;
  private chain;
  private nodeUrl;
  private activeNodeList;
  private pendingTransactions;
  private miningReward;

  constructor(nodeUrl: string, activeNodeList = []) {
    this.chain = [this.createGenisisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 10;
    this.nodeUrl = nodeUrl;
    this.activeNodeList = activeNodeList;
  }

  public getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  public addTransaction(transaction) {
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

  public getKey(user, password) {
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
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

  public getChain() {
    return this.chain;
  }

  public getActiveNodeList() {
    return this.activeNodeList;
  }

  public registerNode(nodeUrl) {
    if (this.activeNodeList.indexOf(nodeUrl) !== -1) {
      throw new Error("the url already exist in the node list");
    }
    this.activeNodeList.push(nodeUrl);
  }

  public getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        balance +=
          transaction.recipient === address
            ? transaction.amount
            : transaction.sender === address
            ? -transaction.amount
            : balance;
      }
    }
    return balance;
  }

  public getTransactions(address) {
    const transactions = [];
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          transactions.push(transaction);
        }
      }
    }
    return transactions;
  }

  public minePendingTransactions(minerRewardAddress) {
    const newBlock = new Block(
      new Date().toUTCString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.pendingTransactions = [
      new Transaction({
        amount: this.miningReward,
        recipient: minerRewardAddress
      })
    ];
  }

  public isBlockChainVailid() {
    for (let index = 1; index < this.chain.length; index++) {
      const currentBlock = this.chain[index];
      const previousBlock = this.chain[index - 1];
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
      if (currentBlock.calculateHash() !== currentBlock.hash) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  private createGenisisBlock() {
    return new Block(new Date().toUTCString(), [new Transaction({})], "");
  }
}

export default BlockChain;
