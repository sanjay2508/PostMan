const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'Secret_Key_sanjay');
        console.log(decodedToken);
        req.userData = { email: decodedToken.email, UserName: decodedToken.name, userId: decodedToken.userId };
        next();
    } catch (err) {
        res.status(401).json({ message: "Auth Failed" });
    }
}