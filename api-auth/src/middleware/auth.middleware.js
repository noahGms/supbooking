import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) return res.status(401).json({error: 'unauthorized'});

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({error: 'unauthorized'});
  }
};