import { createTicketSchema } from "../validator/ticket.validator.js";
import Ticket from "../model/ticket.model.js";
import ticketMapper from "../mapper/ticket.mapper.js";
import axios from 'axios';

export async function findOne(req, res) {
  const id = req.params.id;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found !');
    }

    return res.status(200).json({
      data: ticketMapper(ticket),
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}

export async function create(req, res) {
  const body = req.body;

  try {
    const value = await createTicketSchema.validateAsync(body);

    // get concert info from concerts service
    const concertResponse = await axios.get(`${process.env.API_CONCERTS_URL}/${value.concertId}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    const concert = concertResponse.data.data;

    // check if concerts is full
    const ticketCount = await Ticket.countDocuments({concert: concert.id});
    if (ticketCount >=  concert.seats) {
      throw new Error('No seat available !');
    }

    const ticket = await Ticket.create({
      user: req.user.id,
      concert: concert.id,
    });

    return res.status(201).json({
      message: 'Ticket created !',
      data: ticketMapper({
        ...ticket._doc,
        user: req.user,
        concert: concert,
      }),
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}

export async function paid(req, res) {
  const id = req.params.id;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found !');
    }

    if (ticket.status === 'paid') {
      throw new Error('Ticket already paid !');
    }

    ticket.status = 'paid';
    await ticket.save();

    return res.status(200).json({
      message: 'Ticket paid !',
      data: ticketMapper(ticket),
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}