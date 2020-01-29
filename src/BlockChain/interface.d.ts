// interface
import { TransactionInterface, key } from "../Transaction/interface";
import { BlockInterface } from "../Block/interface";

interface mineReturn {
  newBlock: BlockInterface;
  transaction: TransactionInterface;
}

export interface BlockChainInterface {
  getLatestBlock: () => object;
  addTransaction: (transaction: TransactionInterface) => void;
  getBalance: (address: string) => number;
  minePendingTransactions: (minerRewardAddress: string) => mineReturn;
  isBlockChainVailid: (chain: object[]) => boolean;
  addBlockToChain: (chain) => void;
  getChain: () => object;
  getActiveNodeList: () => string[];
  getCurrentNodeURL: () => string;
  setActiveNodeList: (activeNodeList: string[]) => void;
  verifyTransaction: (transaction: TransactionInterface) => boolean;
  replaceBlockWithLatest: (
    chain: object[],
    pendingTransactions: object[]
  ) => void;
}
