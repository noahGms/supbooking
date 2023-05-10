import {createPaymentSchema} from "../validator/payment.validator.js";
import jwt from 'jsonwebtoken';
import Payment from "../model/payment.model.js";
import axios from "axios";
import {sendConfirmationSms} from "../service/payment.service.js";
import paymentMapper from "../mapper/payment.mapper.js";

export async function findOneByTicketId(req, res) {
  const ticketId = req.params.ticketId;

  try {
    const payment = await Payment.findOne({ticket: ticketId});

    return res.status(200).json({
      message: 'Payment found!',
      data: paymentMapper(payment),
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}

export async function processPayment(req, res) {
  const body = req.body;

  try {
    const value = await createPaymentSchema.validateAsync(body);

    // get ticket info from tickets service
    const ticketResponse = await axios.get(`${process.env.API_TICKETS_URL}/${value.ticketId}`, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });
    const ticket = ticketResponse.data.data;

    const payment = await Payment.create({
      ticket: ticket.id,
      user: req.user.id,
    });

    // sign temporary token for confirmation
    const token = jwt.sign({
      paymentId: payment.id,
      ticketId: ticket.id,
      userId: req.user.id,
    }, process.env.JWT_SECRET, { expiresIn: '15m' });

    payment.token = token;
    await payment.save();

    await sendConfirmationSms(req.user, token)

    return res.status(200).json({
      message: 'Payment processed successfully!',
      data: {
        confirmToken: token,
      },
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}

export async function confirmPayment(req, res) {
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const payment = await Payment.findById(decoded.paymentId);

    if (!payment) {
      throw new Error('Payment not found!');
    }

    // get ticket info from tickets service
    const ticketResponse = await axios.get(`${process.env.API_TICKETS_URL}/${decoded.ticketId}`, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });
    const ticket = ticketResponse.data.data;

    if (ticket.status === 'paid') {
      throw new Error('Ticket already paid!');
    }

    // update ticket status to paid in tickets service
    await axios.put(`${process.env.API_TICKETS_URL}/${decoded.ticketId}/paid`, {}, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });

    payment.confirmedAt = new Date();
    await payment.save();

    return res.status(200).json({
      message: 'Payment confirmed successfully!'
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}

export async function cancelPayment(req, res) {
  const id = req.params.id;

  try {
    const payment = await Payment.findById(id);

    if (!payment) {
      throw new Error('Payment not found!');
    }

    payment.cancelledAt = new Date();
    await payment.save();

    return res.status(200).json({
      message: 'Payment cancelled successfully!'
    });
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}