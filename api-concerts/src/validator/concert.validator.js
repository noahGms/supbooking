import Joi from 'joi';

export const createConcertSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().required(),
  address: Joi.string().required(),
  seats: Joi.number().required(),
});

export const updateConcertSchema = Joi.object({
  name: Joi.string(),
  date: Joi.date(),
  address: Joi.string(),
  seats: Joi.number(),
});