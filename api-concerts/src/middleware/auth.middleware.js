import jwt from 'jsonwebtoken';
import axios from 'axios';

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await jwt.decode(token, process.env.JWT_SECRET);

    let user;
    const response = await axios.get(process.env.API_AUTH_URL + '/whoami', {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    });
    user = response.data.data;

    if (!user) return res.status(401).json({error: 'unauthorized'});

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({error: 'unauthorized'});
  }
};

export const isAdmin = async (req, res, next) => {
  const user = req.user;

  if (!user.is_admin) {
    return res.status(403).json({error: 'forbidden'});
  }

  next();
};