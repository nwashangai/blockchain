export interface key {
  private: string;
  public: string;
}

export interface TransactionInterface {
  calculateHash: () => string;
  signTransaction: (difficulty: object) => void;
  isValid: () => boolean;
}

export interface construct {
  type: string;
  sender?: string;
  recipient?: string;
  amount?: number;
  key?: key;
  data?: object;
}
