const SHA256 = require("crypto-js/sha256");
const Elliptic = require("elliptic").ec;
const ec = new Elliptic("secp256k1");

class Transaction {
  constructor({
    type,
    sender = null,
    recipient = null,
    amount = null,
    key = null,
    data = null
  }) {
    (this.type = type),
      (this.data = data),
      (this.amount = amount),
      (this.recipient = recipient),
      (this.key = key),
      (this.sender = sender);
  }

  calculateHash() {
    return SHA256(
      this.type +
        this.sender +
        this.recipient +
        this.amount +
        this.key +
        this.data
    ).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.sender) {
      throw new Error("You cannot sign transction that doesn't belong to you");
    }

    const hashTX = this.calculateHash();
    const sign = signingKey.sign(hashTX, "base64");
    this.signature = sign.toDER("hex");
  }

  isValid() {
    if (
      (this.type === "mine" && this.sender === null) ||
      this.type === "create"
    )
      return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature to this transaction");
    }

    const publicKey = ec.keyFromPublic(this.sender, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

module.exports = Transaction;
