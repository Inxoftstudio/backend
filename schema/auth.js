const Joi = require("joi");


const userRegisterSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(25).required(),
    confirmPassword: Joi.ref("password")
})

const userLoginSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).max(25).required(),
})

module.exports = {
    userRegisterSchema,
    userLoginSchema
}