import {Request, Response} from 'express'

export const special:any = (req: Request, res: Response) => {
  
  return res.json({ msg: `Hey ${req.body.email}!` });
};