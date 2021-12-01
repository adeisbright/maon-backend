const {isBSON} = require("../lib");
const {BadRequestError} = require("./ErrorHandler");
/**
 * @description checks if an id is a valid BSON
 * @param {*} req http request object
 * @param {*} res http response object
 * @param {*} next a callback to invoke the request handler
 * @return to the request to the next middleware or stops the request by handling request to the error handler
 */
const isValidBSON = (req, res, next) => {
  try {
    if (isBSON(req.params.id)) {
      return next();
    } else {
      throw new Error("Wrong Document id");
    }
  } catch (error) {
    next(new BadRequestError("Wrong Document id"));
  }
};
module.exports = isValidBSON;
