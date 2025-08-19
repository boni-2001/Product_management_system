const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string()
    .valid("Electronics", "Clothes", "Shoes", "Bags")
    .required(),
  description: Joi.string().required(),
});
