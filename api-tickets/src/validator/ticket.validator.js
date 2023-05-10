import Joi from 'joi';

export const createTicketSchema = Joi.object({
  concertId: Joi.string().required(),
});