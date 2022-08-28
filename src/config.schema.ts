import * as Joi from "@hapi/joi";

export const ConfigValidationSchema = Joi.object({
  STAGE: Joi.string().required().default("dev"),
  ORM_HOST: Joi.string().required(),
  ORM_PORT: Joi.number().default(5432).required(),
  ORM_USERNAME: Joi.string().required(),
  ORM_PASSWORD: Joi.string().required(),
  ORM_DATABASE: Joi.string().default("tasks management").required(),
  APP_PORT: Joi.number().required(),
  APP_HOST: Joi.string().required(),
  JWT_SECRECT_KEY: Joi.string().required(),
  JWT_EXPIRATION_SEC: Joi.number().default(3600).required(),
});
