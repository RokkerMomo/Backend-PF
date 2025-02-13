import { Request, Response } from "express"
import usuarios, { IUser } from "../models/user"
import jwt from 'jsonwebtoken'
import config from "../config/config";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, usuario: user.email }, config.jwtSecret, {
    expiresIn: 86400
  });
}

//REGISTRO
export const signUp: any = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password || !req.body.name || !req.body.document) {
    return res.status(400).json({ msg: 'Make sure you enter all the data' })
  }
  const user = await usuarios.findOne({ usuario: req.body.email });
  if (user) {
    return res.status(400).json({ msg: 'The User you entered already exists' });
  }
  //GUARDAR USUARIO
  const newUser = new usuarios(req.body);
  await newUser.save();
  return res.status(201).json({ newUser, msg: 'Correctly Registered User' });
}

//LOGIN
export const signIn: any = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email and password" });
  }

  const user = await usuarios.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({ token: createToken(user), role: user.role });
  }

  return res.status(400).json({
    msg: "The email or password are incorrect"
  });
};