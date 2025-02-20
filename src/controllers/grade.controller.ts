import { Request, Response } from "express"
import grade from "../models/grade";
import hasAccess, { IhasAccess } from "../models/hasAccsess"
import jwt from 'jsonwebtoken'
import config from "../config/config";



//NewGrade
export const NewGrade: any = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.name || !req.body.desc || !req.body.slogan || !req.body.price || !req.body.url_pic || !req.body.vidId) {
        return res.status(400).json({ msg: 'asegurate de ingresar todos los datos' })
    }
    const user = await grade.findOne({ name: req.body.name });
    if (user) {
        return res.status(400).json({ msg: 'Ya existe el grado que intentas ingresar' });
    }
    //GUARDAR Grade
    const newUser = new grade(req.body);
    await newUser.save();
    return res.status(201).json({ newUser, msg: 'grade registrado correctamente' });
}


//GET GRADES
export const getGrades: any = async (req: Request, res: Response): Promise<Response> => {
    const grades = await grade.find();
    return res.status(200).json(grades);
}

//get Grade
export const getGrade: any = async (req: Request, res: Response): Promise<Response> => {
    const grades = await grade.findById(req.params.id);
    return res.status(200).json(grades);
}


// get Grades Table
export const getGradesTable: any = async (req: Request, res: Response): Promise<Response> => {
    const grades = await grade.find();
    const gradesWithStudents = await Promise.all(grades.map(async (grade) => {
        const accessCount = await hasAccess.countDocuments({ id_grade: grade._id });
        return {
            ...grade.toObject(),
            students: accessCount
        };
    }));
    return res.status(200).json(gradesWithStudents);
}


// Update Grade
export const updateGrade: any = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { vidId, price, ...updateData } = req.body; // Exclude vidId from the update data

    // Validate that price is a number
    if (price !== undefined && typeof price !== 'number') {
        return res.status(400).json({ msg: 'Price must be a number' });
    }

    // Include price in updateData if it is valid
    if (price !== undefined) {
        updateData.price = price;
    }

    const updatedGrade = await grade.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGrade) {
        return res.status(404).json({ msg: 'Grade not found' });
    }
    return res.status(200).json({ updatedGrade, msg: 'Grade updated successfully' });
}

// Delete Grade
export const deleteGrade: any = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    // Delete user's access to grades
    await hasAccess.deleteMany({ id_grade: id });
    const deletedGrade = await grade.findByIdAndDelete(id);
    if (!deletedGrade) {
        return res.status(404).json({ msg: 'Grade not found' });
    }
    return res.status(200).json({ msg: 'Grade deleted successfully' });
}