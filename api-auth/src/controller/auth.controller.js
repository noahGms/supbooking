import User from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import userMapper from "../mapper/user.mapper.js";
import {loginSchema, registerSchema} from "../validator/auth.validator.js";

export async function register(req, res) {
  const body = req.body;

  try {
    const value = await registerSchema.validateAsync(body);

    const userAlreadyExist = await User.findOne({email: value.email});

    if (userAlreadyExist) {
      throw new Error('User already exist !');
    }

    await User.create(value);
  } catch (error) {
    return res.json({message: error.message}, 400);
  }

  return res.json({message: 'Register success !'}, 201);
}

export async function login(req, res) {
  const body = req.body;

  try {
    const value = await loginSchema.validateAsync(body);
    const user = await User.findOne({email: value.email});

    if (!user || !await user.comparePassword(value.password)) {
      throw new Error('Bad email or password !');
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.cookie('token_bearer', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      message: 'Login success !',
      token_bearer: token,
    });
  } catch (error) {
    return res.json({message: error.message}, 400);
  }
}

export async function whoami(req, res) {
  return res.json({
    data: userMapper(req.user),
  }, 200);
}