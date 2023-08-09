const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRECT, REFRESH_TOKEN_SECRECT } = require("../config");
const RefreshToken = require("../models/token")


class JWTService {

    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, ACCESS_TOKEN_SECRECT, { expiresIn: expiryTime })
    }

    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, REFRESH_TOKEN_SECRECT, { expiresIn: expiryTime })
    }

    static verifyAccessToken(token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRECT)
    }

    static verifyRefreshToken(token) {
        return jwt.verify(token, REFRESH_TOKEN_SECRECT)
    }

    static async storeRefreshToken(token, userId) {

        try {
            const newToken = new RefreshToken({
                token: token,
                userId: userId
            })
            await newToken.save()

        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = JWTService;