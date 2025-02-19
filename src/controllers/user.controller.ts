import { Request, Response } from "express"
import usuarios, { IUser } from "../models/user"
import grade from "../models/grade";
import hasAccess, { IhasAccess } from "../models/hasAccsess"
import jwt from 'jsonwebtoken'
import config from "../config/config";

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, usuario: user.email }, config.jwtSecret, {
    expiresIn: 86400
  });
}

//REGISTRO
export const signUp: any = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password || !req.body.name || !req.body.document || !req.body.class) {
    return res.status(400).json({ msg: 'Make sure you enter all the data' })
  }
  const user = await usuarios.findOne({ usuario: req.body.email });
  if (user) {
    return res.status(400).json({ msg: 'The User you entered already exists' });
  }
  //GUARDAR USUARIO
  const newUser = new usuarios(req.body);
  await newUser.save();

  for (let index = 0; index < req.body.class.length; index++) {
    const newHasAccess = new hasAccess({
      id_user: newUser._id,
      id_grade: req.body.class[index],
    });
    await newHasAccess.save();

  }
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
    return res.status(200).json({ token: createToken(user), role: user.role, name: user.name, email: user.email, document: user.document });
  }

  return res.status(400).json({
    msg: "The email or password are incorrect"
  });
};


// Get Users with Role "user"
export const getUsersWithRoleUser: any = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await usuarios.find({ role: 'user' });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msg: 'Error retrieving users', error });
  }
};


// Get User by ID
export const getUserById: any = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await usuarios.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find the grades the user has access to
    const accessRecords = await hasAccess.find({ id_user: id });
    const gradeIds = accessRecords.map(record => record.id_grade);
    const grades = await grade.find({ _id: { $in: gradeIds } });

    return res.status(200).json({ user, grades });
  } catch (error) {
    return res.status(500).json({ msg: 'Error retrieving user', error });
  }
};


