import SHA256 from "crypto-js/sha256";
import Elliptic from "elliptic";
const ec = new Elliptic.ec("secp256k1");

// interface
import {
  construct,
  TransactionBuilder,
  TransactionInterface
} from "./interface";

class Transaction implements TransactionInterface {
  public static builder(transaction: TransactionBuilder) {
    const { sender, recipient, amount, signature, payload } = transaction;
    return new Transaction({ sender, recipient, amount, signature, payload });
  }

  private sender = null;
  private recipient = null;
  private payload = {};
  private signature;
  private amount;

  constructor({
    sender = null,
    recipient = null,
    amount = 0,
    payload = {},
    signature
  }: construct) {
    (this.payload = payload),
      (this.amount = amount),
      (this.recipient = recipient),
      (this.sender = sender),
      (this.signature = signature);
  }

  public calculateHash = () => {
    return SHA256(
      this.sender + this.recipient + this.amount + this.payload
    ).toString();
  };

  public signTransaction = signingKey => {
    if (signingKey.getPublic("hex") !== this.sender) {
      throw new Error("You cannot sign transction that doesn't belong to you");
    }

    const hashTX = this.calculateHash();
    const sign = signingKey.sign(hashTX, "base64");
    this.signature = sign.toDER("hex");
  };

  public getSender = () => {
    return this.sender;
  };

  public getRecipient = () => {
    return this.recipient;
  };

  public isValid = () => {
    if (!this.sender) {
      return true;
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature to this transaction");
    }

    const publicKey = ec.keyFromPublic(this.sender, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  };
}

export default Transaction;
