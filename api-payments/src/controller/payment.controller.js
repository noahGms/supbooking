import { createPaymentSchema } from "../validator/payment.validator.js";
import jwt from 'jsonwebtoken';
import Payment from "../model/payment.model.js";
import axios from "axios";
import twilio from 'twilio';

export async function processPayment(req, res) {
  const body = req.body;

  try {
    const value = await createPaymentSchema.validateAsync(body);

    const ticketResponse = await axios.get(process.env.API_TICKETS_URL + '/' + value.ticketId, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });
    const ticket = ticketResponse.data.data;

    const payment = await Payment.create({
      ticket: ticket.id,
      user: req.user.id,
    });

    const token = jwt.sign({
      paymentId: payment.id,
      ticketId: ticket.id,
      userId: req.user.id,
    }, process.env.JWT_SECRET, { expiresIn: '15m' });

    payment.token = token;
    await payment.save();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_NUMBER;
    
    if (accountSid && authToken && twilioNumber) {
      const client = twilio(accountSid, authToken);

      await client.messages.create({
        body: 'Confirm your payment: ' + process.env.API_PAYMENTS_URL + '/confirm/' + token,
        from: twilioNumber,
        to: req.user.phone_number,
      });
    }

    return res.json({
      message: 'Payment processed successfully!',
      data: {
        confirmToken: token,
      },
    });
  } catch (error) {
    return res.json({message: error.message}, 400);
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

    const ticketResponse = await axios.get(process.env.API_TICKETS_URL + '/' + decoded.ticketId, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });
    const ticket = ticketResponse.data.data;

    if (ticket.status === 'sold') {
      throw new Error('Ticket already sold!');
    }

    await axios.put(`${process.env.API_TICKETS_URL}/${decoded.ticketId}/paid`, {}, {
      headers: {
        Cookie: req.headers.cookie,
      }
    });

    payment.confirmedAt = new Date();
    await payment.save();

    return res.json({message: 'Payment confirmed successfully!'});
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}