import { Request, Response } from "express"
import grade from "../models/grade";
import jwt from 'jsonwebtoken'
import config from "../config/config";



    //NewGrade
export const NewGrade:any = async (req: Request,res: Response): Promise<Response> =>{
    if (!req.body.name || !req.body.desc || !req.body.slogan || !req.body.price || !req.body.url_pic || !req.body.vidId) {
        return res.status(400).json({msg:'asegurate de ingresar todos los datos'})
    }
    const user = await grade.findOne({name:req.body.name});
    if(user){
        return res.status(400).json({msg:'Ya existe el grado que intentas ingresar'});
    }
    //GUARDAR Grade
    const newUser = new grade(req.body);
    await newUser.save();
    return res.status(201).json({newUser,msg:'grade registrado correctamente'});
}


//GET GRADES
export const getGrades:any = async (req: Request,res: Response): Promise<Response> =>{
    const grades = await grade.find();
    return res.status(200).json(grades);
}

//get Grade
export const getGrade:any = async (req: Request,res: Response): Promise<Response> =>{
    const grades = await grade.findById(req.params.id);
    return res.status(200).json(grades);
}