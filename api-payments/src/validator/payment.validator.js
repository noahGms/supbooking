import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  ticketId: Joi.string().required(),
});