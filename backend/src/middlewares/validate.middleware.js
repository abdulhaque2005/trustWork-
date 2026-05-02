const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/responseHandler");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return ApiResponse.error(res, messages.join(", "), 400, errors.array());
  }
  next();
};

module.exports = validate;
