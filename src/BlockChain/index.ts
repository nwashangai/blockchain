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

  public verifyTransaction(transaction) {
    if (!transaction.getSender || !transaction.getRecipient) {
      return false;
    }
    if (!transaction.isValid()) {
      return false;
    }
    return true;
  }

  public addTransaction(transaction) {
    if (this.verifyTransaction(transaction)) {
      this.pendingTransactions.push(transaction);
    } else {
      throw new Error("Blocks must be valid with from and to addresses");
    }
  }

  public getChain() {
    return {
      chain: this.chain,
      currentUrl: this.nodeUrl,
      networkNodes: Array.from(new Set([this.nodeUrl, ...this.activeNodeList])),
      pendingTransactions: this.pendingTransactions
    };
  }

  public getActiveNodeList() {
    return [...this.activeNodeList];
  }

  public getCurrentNodeURL() {
    return this.nodeUrl;
  }

  public setActiveNodeList(activeNodeList) {
    activeNodeList.forEach(url => {
      if (this.activeNodeList.indexOf(url) === -1) {
        this.activeNodeList.push(url);
      }
    });
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

  public isBlockChainVailid(chain) {
    for (let index = 1; index < chain.length; index++) {
      const currentBlock = chain[index];
      const previousBlock = chain[index - 1];
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

  public replaceBlockWithLatest(chain, pendingTransactions) {
    if (
      this.isBlockChainVailid(chain) &&
      this.verifyBulkTransations(pendingTransactions)
    ) {
      [this.chain, this.pendingTransactions] = [chain, pendingTransactions];
    } else {
      throw Error("Blockchain is invalid");
    }
  }

  private verifyBulkTransations(transactions) {
    let isValid = true;
    transactions.forEach(transaction => {
      if (!this.verifyTransaction(new Transaction(transaction))) {
        isValid = !isValid;
      }
    });
    return isValid;
  }

  private createGenisisBlock() {
    return new Block(new Date().toUTCString(), [new Transaction({})], "");
  }
}

export default BlockChain;
