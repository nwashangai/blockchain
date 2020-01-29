// interface
import { TransactionInterface } from "../Transaction/interface";

export interface BlockInterface {
  mineBlock: (difficulty: string) => void;
  isBlockValid: (chain: BlockInterface[]) => boolean;
}

export interface BlockBuilder {
  timestamp: string;
  proofOfWork: number;
  previousHash: string;
  hash: string;
  transactions: TransactionInterface[];
}
