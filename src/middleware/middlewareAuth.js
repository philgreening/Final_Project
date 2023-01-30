// class Middleware {
//     async decodeToken(req, res, next) {
//         const token = req.headers.authorization.split('')[1];
//         try {
//             const decodeValue = await db.admin.auth().verifyIdToken(token);
//             if(decodeValue){
//                 return next();
//             }
//             return res.json({message: 'Un authorized'});
//         } catch (error) {
//             return res.json({message: "Internal Error"});
//         }
//     }
// }

const authenticate = async (req, res, next) => {
  console.log(req.headers);
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      res.status(403).send("Unauthorized");
      return;
    }
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      // console.log(idToken);
      // const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      // req.user = decodedIdToken;
      // console.log("decoded");
      console.log(idToken)
      admin.auth().verifyIdToken(idToken)
      .then((decodedIdToken) => {
        const uid = decodedIdToken.uid;
        req.user = uid;
      })
    // next();
    } catch (error) {
      res.status(403).send("Unauthorized");
      console.log("Unauthorized")
    }
  };
  

module.exports = authenticate;