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
  sender?: string;
  recipient?: string;
  amount?: number;
  data?: object;
}
