const Joi = require("joi");
const { ApplicationError, BadRequestError } = require("./ErrorHandler");

class Validator {
    static async validateAddQuestion(req, res, next) {
        try {
            const { title, content, author } = req.body;

            const schema = Joi.object({
                title: Joi.string()
                    .alphanum()
                    .min(2)
                    .required()
                    .message("Please , title is necessary"),
                content: Joi.string()
                    .alphanum()
                    .min(2)
                    .required()
                    .message("Content cannot be empty"),
                author: Joi.object().keys({
                    email: Joi.string()
                        .email({
                            minDomainSegments: 2,
                            tlds: { allow: ["com", "net"] },
                        })
                        .message("Provide a valid email"),
                    name: Joi.string()
                        .min(2)
                        .required()
                        .message("Add your name"),
                }),
            });
            const { error, value } = await schema.validate({
                title: title,
                content: content,
                author: author,
            });
            if (error) {
                return next(new BadRequestError(error.message));
            }
            next();
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = Validator;
