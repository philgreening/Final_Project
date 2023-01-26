class Middleware {
    async decodeToken(req, res, next) {
        const token = req.headers.authorization.split('')[1];
        try {
            const decodeValue = await db.admin.auth().verifyIdToken(token);
            if(decodeValue){
                return next();
            }
            return res.json({message: 'Un authorized'});
        } catch (error) {
            return res.json({message: "Internal Error"});
        }
    }
}

module.exports = new Middleware();