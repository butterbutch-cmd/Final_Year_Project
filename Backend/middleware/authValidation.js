const Joi = require("joi");

const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const setPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(strongPassword)
    .required()
    .messages({
      "string.empty": "Password is required",

      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long",
    }),
});

module.exports = {
  setPasswordSchema,
};