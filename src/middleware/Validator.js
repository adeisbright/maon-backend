const Joi = require("joi");
const {BadRequestError} = require("./ErrorHandler");

class Validator {
  static async validateAddContent(req, res, next) {
    try {
      const {title, content, author} = req.body;

      const schema = Joi.object({
        title: Joi.string().min(2).required(),
        content: Joi.string().min(2).required(),
        author: Joi.object().keys({
          email: Joi.string()
              .email({
                minDomainSegments: 2,
                tlds: {
                  allow: [
                    "com",
                    "net",
                    "io",
                    "org",
                    "events",
                    "info",
                  ],
                },
              })
              .required(),
          name: Joi.string().min(2).max(40).required(),
        }),
      });
      const {error, value} = await schema.validateAsync({
        title: title,
        content: content,
        author: author,
      });
      next();
    } catch (error) {
      return next(new BadRequestError(error.message));
    }
  }
  static async validateSearchParams(req, res, next) {
    try {
      const {q, page_no, limit, filter} = req.query;
      const Schema = Joi.object({
        filter: Joi.string(),
        pageNo: Joi.number(),
        limit: Joi.number(),
        query: Joi.string().required(),
      });

      const {error, value} = await Schema.validateAsync({
        query: q,
        limit: limit,
        pageNo: page_no,
        filter: filter,
      });
      next();
    } catch (error) {
      return next(new BadRequestError(error.message));
    }
  }
}

module.exports = Validator;
