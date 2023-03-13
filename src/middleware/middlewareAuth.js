const { admin } = require("../config");


const authenticate = async (req, res, next) => {
  console.log(req.headers);
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      res.status(401).send({ msg: "Unauthorised" });
      console.log("middlewaire line 20")
      return;
    }
    try {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      console.log("idtokencalled ",idToken);
      const decodedIdToken = await admin.auth().verifyIdToken(idToken)
      console.log("decodedtokenCalled ", decodedIdToken);
      let uid = decodedIdToken.uid;
      console.log(uid);
      next();
    } catch (error) {
      res.status(401).send({ msg: "Unauthorised" });
      console.log("Unauthorized line 30")
    }
  };
  

module.exports = authenticate;