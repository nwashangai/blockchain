// interface
import { TransactionInterface } from "../Transaction/interface";

export interface BlockInterface {
  mineBlock: (difficulty: string) => void;
  hasValidTransactions: () => boolean;
}
