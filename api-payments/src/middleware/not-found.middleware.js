import Payment from "../model/payment.model.js";

export const notFound = async (req, res, next) => {
  const id = req.params.id;

  try {
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({error: 'not found'});
    }

    req.payment = payment;
    next();
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
}