import Elliptic from "elliptic";

const ec = new Elliptic.ec("secp256k1");

export default (req, res, next) => {
  const privateKey = req.headers["x-access-key"];

  if (privateKey) {
    try {
      const signature = ec.keyFromPrivate(privateKey);
      req.body.signature = signature;
      next();
    } catch (error) {
      return res.status(401).send({ status: "error", message: error.message });
    }
  } else {
    return res
      .status(401)
      .send({ status: "error", message: "No token provided." });
  }
};
