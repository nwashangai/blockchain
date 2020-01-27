// interface
import { TransactionInterface, key } from "../Transaction/interface";

export interface BlockChainInterface {
  getLatestBlock: () => object;
  addTransaction: (transaction: TransactionInterface) => void;
  getBalance: (address: string) => number;
  minePendingTransactions: (minerRewardAddress: string) => void;
  isBlockChainVailid: (chain: object[]) => boolean;
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
