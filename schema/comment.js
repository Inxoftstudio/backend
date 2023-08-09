const Joi = require("joi");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().regex(mongodbIdPattern).required(),
    blog: Joi.string().regex(mongodbIdPattern).required(),
})


const commentByIdSchema = Joi.object({
    id: Joi.string().regex(mongodbIdPattern).required(),
})


module.exports = {
   commentSchema,
   commentByIdSchema
};