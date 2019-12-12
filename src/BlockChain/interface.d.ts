// interface
import { TransactionInterface, key } from "../Transaction/interface";

export interface BlockChainInterface {
  getLatestBlock: () => object;
  addTransaction: (transaction: TransactionInterface) => void;
  getKey: (user: string, password: string) => key;
  getBalance: (address: string) => number;
  minePendingTransactions: (minerRewardAddress: string) => void;
  isBlockChainVailid: () => boolean;
  getChain: () => object[];
}
