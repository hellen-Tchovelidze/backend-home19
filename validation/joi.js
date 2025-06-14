const Joi = require("joi");

const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().required(),
});

const postCreateSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  title: Joi.string().required(),
  content: Joi.string().allow("").optional(),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().allow("").optional(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  postCreateSchema,
  postUpdateSchema,
};
