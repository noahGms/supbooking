import Concert from "../model/concert.model.js";
import concertMapper from "../mapper/concert.mapper.js";
import {createConcertSchema, updateConcertSchema} from "../validator/concert.validator.js";
import axios from 'axios';

export async function findAll(req, res) {
  const concerts = await Concert.find();
  return res.json({
    data: concerts.map(concert => concertMapper(concert)),
  }, 200);
}

export async function findOne(req, res) {
  try {
    const concert = await Concert.findById(req.params.id);

    if (!concert) {
      throw new Error('Concert not found !');
    }

    return res.json({
      data: concertMapper(concert),
    }, 200);
  } catch (error) {
    return res.json({message: error.message}, 404);
  }
}

export async function create(req, res) {
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

export async function update(req, res) {
  const body = req.body;

  try {
    const concert = await Concert.findById(req.params.id);

    if (!concert) {
      throw new Error('Concert not found !');
    }

    const value = await updateConcertSchema.validateAsync(body);

    await Concert.updateOne({
      _id: req.params.id,
    }, {
      $set: value,
    });

    return res.json({
      message: 'Concert updated !',
      data: concertMapper(concert),
    }, 200);
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}

export async function destroy(req, res) {
  try {
    const concert = await Concert.findById(req.params.id);

    if (!concert) {
      throw new Error('Concert not found !');
    }

    await Concert.deleteOne({
      _id: req.params.id,
    });

    return res.json({
      message: 'Concert deleted !',
    }, 200);
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}

export async function buyTicket(req, res) {
  try {
    const concert = await Concert.findById(req.params.id);

    if (!concert) {
      throw new Error('Concert not found !');
    }

    const response = await axios.post(process.env.API_TICKET_URL, {
      concertId: concert._id,
    }, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });

    return res.status(201).json({
      message: 'Ticket bought !',
      ticket: response.data.data,
    });
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}