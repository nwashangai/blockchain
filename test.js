const Elliptic = require("elliptic");

const ec = new Elliptic.ec("secp256k1");

const key = ec.genKeyPair();

console.log(key.getPrivate("hex"));
console.log("");
console.log(key.getPublic("hex"));
