import {createTicketSchema} from "../validator/ticket.validator.js";
import Ticket from "../model/ticket.model.js";
import ticketMapper from "../mapper/ticket.mapper.js";
import axios from 'axios';

class TicketController {
  /**
   * GET /tickets/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async findOne(req, res) {
    const ticket = req.ticket;

    return res.status(200).json({
      data: ticketMapper(ticket),
    });
  }

  /**
   * POST /tickets
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res) {
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
      const ticketCount = await Ticket.countDocuments({
        concert: concert.id,
        status: {
          '$ne': 'cancelled',
        }
      });

      if (ticketCount >= concert.seats) {
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

  /**
   * POST /tickets/:id/cancel
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async cancel(req, res) {
    const ticket = req.ticket;

    try {
      if (ticket.status === 'cancelled') {
        throw new Error('Ticket already cancelled !');
      }

      if (ticket.status === 'paid') {
        throw new Error('Ticket already paid !');
      }

      // get payment info associated to ticket from payments service
      const paymentResponse = await axios.get(`${process.env.API_PAYMENTS_URL}/by-ticket/${ticket._id}`, {
        headers: {
          Cookie: req.headers.cookie,
        }
      });
      const payment = paymentResponse.data.data;

      // cancel payment from payments service
      await axios.post(`${process.env.API_PAYMENTS_URL}/${payment.id}/cancel`, {}, {
        headers: {
          Cookie: req.headers.cookie,
        }
      });

      await Ticket.updateOne({_id: ticket._id}, {
        status: 'cancelled',
      });

      return res.status(200).json({
        message: 'Ticket cancelled !',
        data: ticketMapper(ticket),
      });
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }

  /**
   * POST /tickets/:id/paid
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async setPaid(req, res) {
    const ticket = req.ticket;

    try {
      if (ticket.status === 'paid') {
        throw new Error('Ticket already paid !');
      }

      await Ticket.updateOne({_id: ticket._id}, {
        status: 'paid',
      });

      return res.status(200).json({
        message: 'Ticket paid !',
        data: ticketMapper(ticket),
      });
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
}

export default new TicketController();