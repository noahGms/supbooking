import Ticket from "../model/ticket.model.js";

export const notFound = async (req, res, next) => {
  const id = req.params.id;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({error: 'not found'});
    }

    req.ticket = ticket;
    next();
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
}