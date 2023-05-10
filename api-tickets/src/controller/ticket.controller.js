import { createTicketSchema } from "../validator/ticket.validator.js";
import Ticket from "../model/ticket.model.js";
import ticketMapper from "../mapper/ticket.mapper.js";
import axios from 'axios';

export async function create(req, res) {
  const body = req.body;

  try {
    const value = await createTicketSchema.validateAsync(body);

    const concertResponse = await axios.get(process.env.API_CONCERTS_URL + '/' + value.concertId, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    const concert = concertResponse.data.data;

    const ticketCount = await Ticket.countDocuments({concert: concert.id});
    if (ticketCount >=  concert.seats) {
      throw new Error('No seat available !');
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      concert: concert.id,
    });

    return res.json({
      message: 'Ticket created !',
      data: ticketMapper({
        ...ticket._doc,
        user: req.user,
        concert: concert,
      }),
    }, 201);
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}