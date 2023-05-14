import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  ticketId: Joi.string().required(),
  creditCard: Joi.object({
    number: Joi.string().required(),
    expiration: Joi.string().required(),
    cvv: Joi.string().required(),
  }),
});

export const checkCreditCardSchema = Joi.object({
  creditCard: Joi.object({
    number: Joi.string().required(),
    expiration: Joi.string().required(),
    cvv: Joi.string().required(),
  }),
});