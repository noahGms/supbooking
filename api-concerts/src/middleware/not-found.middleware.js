import Concert from "../model/concert.model.js";

export const notFound = async (req, res, next) => {
  const id = req.params.id;

  try {
    const concert = await Concert.findById(id);

    if (!concert) {
      return res.status(404).json({error: 'not found'});
    }

    req.concert = concert;
    next();
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
}