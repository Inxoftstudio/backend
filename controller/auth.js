const { userRegisterSchema, userLoginSchema } = require("../schema/auth");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWT");
const RefreshToken = require("../models/token")


const authController = {

    async register(req, res, next) {

        // validation user input with joi schema 
        const { error } = userRegisterSchema.validate(req.body)
        
        if (error) {
            return next(error)
        }

        // destructure input fields
        const { email, username, name, password } = req.body;

        // validate email and username exists
        try {
            const emailInUse = await User.exists({ email });
            const usernameInUse = await User.exists({ username });

            if (emailInUse) {
                const error = {
                    status: 409,
                    message: "Email already registered, Use another Email!"
                }
                return next(error)
            }

            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: "Username not available, Choose another Username!"
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        // Secure Password
        const hashPassword = await bcrypt.hash(password, 10)


        let accessToken
        let refreshToken
        let user

        try {
            // Store User in Database
            const userToRegister = new User({
                username,
                name,
                email,
                password: hashPassword
            })
            user = await userToRegister.save()

            // token generation
            accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

            refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
        }
        catch (error) {
            return next(error);
        }

        // store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id);

        // send tokens in cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        const userDTO = new UserDTO(user)
        return res.status(201).json({ user: userDTO, auth: true })

    },
    
    async login(req, res, next) {

        // validation user input with joi schema 
        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            return next(error)
        }

        // destructure input field
        const { username, password } = req.body;

        let user;
        try {
            user = await User.findOne({ username: username })

            if (!user) {
                const error = {
                    status: 401,
                    message: "Invalid Username"
                }
                return next(error)
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                const error = {
                    status: 401,
                    message: "Invalid Password"
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
        const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");


        // update refresh token in database
        try {
            await RefreshToken.updateOne({
                _id: user._id
            },
                { token: refreshToken },
                { upsert: true }
            )
        } catch (error) {
            return next(error)
        }


        // store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id);

        // send tokens in cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        const userDTO = new UserDTO(user)
        return res.status(200).json({ user: userDTO, auth: true })
    },

    async logout(req, res, next) {
        const { refreshToken } = req.cookies;

        // delete token from database
        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error) {
            return next(error)
        }

        // delete cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        // get response
        res.status(200).json({ user: null, auth: false });
    },

    async refresh(req, res, next) {

        const originalRefreshToken = req.cookies.refreshToken;

        let id;

        try {
            id = await JWTService.verifyRefreshToken(originalRefreshToken)._id
        } catch (e) {
            const error = {
                status: 401,
                message: "Unauthorized"
            };
            return next(error)
        }


        try {
            const match = RefreshToken.findOne({
                _id: id,
                token: originalRefreshToken
            })

            if (!match) {
                const error = {
                    status: 401,
                    message: "Unauthorized"
                }
                return next(error)
            }

        } catch (e) {
            return next(e)
        }

        try {
            const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
            const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

            await RefreshToken.updateOne({ _id: id }, { token: refreshToken })

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })


            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
        } catch (e) {
            return next(e)
        }

        const user = await User.findOne({ _id: id });

        const userDto = new UserDTO(user);

        return res.status(200).json({ user: userDto, auth: true })
    }

}

module.exports = authController