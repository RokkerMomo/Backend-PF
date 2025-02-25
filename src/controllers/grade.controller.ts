import { Request, Response } from "express"
import grade from "../models/grade";
import hasAccess, { IhasAccess } from "../models/hasAccsess"
import classes from "../models/class";
import jwt from 'jsonwebtoken'
import config from "../config/config";
import usuarios, { IUser } from "../models/user"


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

// get Grade
export const getGrade: any = async (req: Request, res: Response): Promise<Response> => {
    try {
        const gradeData = await grade.findById(req.params.id);
        if (!gradeData) {
            return res.status(404).json({ msg: 'Grade not found' });
        }

        const studentCount = await hasAccess.countDocuments({ id_grade: req.params.id });
        const classCount = await classes.countDocuments({ id_grade: req.params.id })

        return res.status(200).json({ ...gradeData.toObject(), students: studentCount, classes: classCount });
    } catch (error) {
        console.error('Error retrieving grade:', error);
        return res.status(500).json({ msg: 'Error retrieving grade', error });
    }
};


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

// Get User Grades
export const getUserGrades: any = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        console.log(`Fetching grades for user ID: ${id}`);

        // Find the user by ID
        const user = await usuarios.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the user is an admin
        if (user.role.toString() === 'admin') {
            const grades = await grade.find();
            return res.status(200).json(grades);
        }

        // Find the grades the user has access to
        const accessRecords = await hasAccess.find({ id_user: id });
        console.log(`Access records found: ${accessRecords.length}`);

        if (accessRecords.length === 0) {
            return res.status(404).json({ msg: 'No grades found for this user' });
        }

        const gradeIds = accessRecords.map(record => record.id_grade);
        const grades = await grade.find({ _id: { $in: gradeIds } });

        return res.status(200).json(grades);
    } catch (error) {
        console.error('Error retrieving user grades:', error);
        return res.status(500).json({ msg: 'Error retrieving user grades', error });
    }
};