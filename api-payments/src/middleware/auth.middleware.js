import axios from 'axios';

export const isAuth = async (req, res, next) => {
  try {
    let user;
    const response = await axios.get(process.env.API_AUTH_URL + '/whoami', {
      headers: {
        Cookie: req.headers.cookie,
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