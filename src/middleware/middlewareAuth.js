const logger = require("../logger");
const { admin } = require("../config");

// Define authenticate middleware function
const authenticate = async (req, res, next) => {
  // Check if the authorization header is present and starts with "Bearer "
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(401).send({ msg: "Unauthorised" });
    logger.info("Unauthorised");
    return;
  }
  try {
    // Extract the bearer token from the authorization header
    const idToken = req.headers.authorization.split("Bearer ")[1];
    // Verify the token using Firebase Admin
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    let uid = decodedIdToken.uid;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Unauthorised" });
    logger.error(error);
  }
};

module.exports = authenticate;
