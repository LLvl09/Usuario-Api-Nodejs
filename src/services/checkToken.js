const config = require("../config/config");
const jwt = require('jsonwebtoken');

exports.check = function(req, res, next)  {
    const authHeader= req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).send({
            message: 'Acess denied'
        });
    } else {
        jwt.verify(token, config.SECRET_TOKEN, function (error, decoded) {
            if (error) {
                res.status(401).send({
                    message: 'Token invalid'
                });
            } else {
                next();
            }
        });
    }
}
