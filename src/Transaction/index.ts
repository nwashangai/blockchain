import SHA256 from "crypto-js/sha256";
import Elliptic from "elliptic";
const ec = new Elliptic.ec("secp256k1");

// interface
import { construct, TransactionInterface } from "./interface";

class Transaction implements TransactionInterface {
  private type;
  private sender = null;
  private recipient = null;
  private amount = null;
  private key = null;
  private data = null;
  private signature;

  constructor({
    type,
    sender = null,
    recipient = null,
    amount = null,
    key = null,
    data = null
  }: construct) {
    (this.type = type),
      (this.data = data),
      (this.amount = amount),
      (this.recipient = recipient),
      (this.key = key),
      (this.sender = sender);
  }

  public calculateHash() {
    return SHA256(
      this.type +
        this.sender +
        this.recipient +
        this.amount +
        this.key +
        this.data
    ).toString();
  }

  public signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.sender) {
      throw new Error("You cannot sign transction that doesn't belong to you");
    }

    const hashTX = this.calculateHash();
    const sign = signingKey.sign(hashTX, "base64");
    this.signature = sign.toDER("hex");
  }

  public isValid() {
    if (
      (this.type === "mine" && this.sender === null) ||
      this.type === "create"
    ) {
      return true;
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature to this transaction");
    }

    const publicKey = ec.keyFromPublic(this.sender, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export default Transaction;
