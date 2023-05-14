import Concert from "../model/concert.model.js";
import concertMapper from "../mapper/concert.mapper.js";
import {createConcertSchema, updateConcertSchema} from "../validator/concert.validator.js";
import axios, {AxiosError} from 'axios';

class ConcertController {
  /**
   * GET /concerts
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async findAll(req, res) {
    const concerts = await Concert.find();

    return res.json({
      data: concerts.map(concert => concertMapper(concert)),
    }, 200);
  }

  /**
   * GET /concerts/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async findOne(req, res) {
    const concert = req.concert;

    return res.json({
      data: concertMapper(concert),
    }, 200);
  }

  /**
   * POST /concerts
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res) {
    const body = req.body;

    try {
      const value = await createConcertSchema.validateAsync(body);
      const concertAlreadyExist = await Concert.findOne({name: value.name});

      if (concertAlreadyExist) {
        throw new Error('Concert already exist !');
      }

      const concert = await Concert.create(body);

      return res.json({
        message: 'Concert created !',
        data: concertMapper(concert),
      }, 201);
    } catch (error) {
      return res.json({message: error.message}, 400);
    }
  }

  /**
   * PUT /concerts/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async update(req, res) {
    const body = req.body;
    const concert = req.concert;

    try {
      const value = await updateConcertSchema.validateAsync(body);

      await Concert.updateOne({
        _id: concert._id,
      }, {
        $set: value,
      });

      return res.json({
        message: 'Concert updated !',
      }, 200);
    } catch (error) {
      return res.json({message: error.message}, 400);
    }
  }

  /**
   * DELETE /concerts/:id
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async destroy(req, res) {
    const concert = req.concert;

    try {
      await Concert.deleteOne({
        _id: concert._id,
      });

      return res.json({
        message: 'Concert deleted !',
      }, 200);
    } catch (error) {
      return res.json({message: error.message}, 400);
    }
  }

  /**
   * POST /concerts/:id/buy
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async buyTicket(req, res) {
    const body = req.body;
    const concert = req.concert;

    try {
      // const verify credit card from payments service
      await axios.post(`${process.env.API_PAYMENTS_URL}/verify-credit-card`, {
        creditCard: body.creditCard,
      }, {
        headers: {
          Cookie: req.headers.cookie,
        },
      });

      // create ticket from tickets service
      const ticketResponse = await axios.post(process.env.API_TICKETS_URL, {
        concertId: concert._id,
      }, {
        headers: {
          Cookie: req.headers.cookie,
        },
      });
      const ticket = ticketResponse.data.data;

      // process payment from payments service
      const paymentResponse = await axios.post(`${process.env.API_PAYMENTS_URL}/process`, {
        ticketId: ticket.id,
        creditCard: body.creditCard,
      }, {
        headers: {
          Cookie: req.headers.cookie,
        },
      });
      const confirmToken = paymentResponse.data.data.confirmToken;

      return res.status(200).json({
        message: 'Ticket bought !',
        data: ticket,
        confirmToken: confirmToken,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        return res.status(400).json({message: response.data.message});
      }

      return res.status(400).json({message: error.message});
    }
  }
}

export default new ConcertController();
