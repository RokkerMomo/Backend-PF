import { Request, Response } from "express";
import classes from "../models/class";

// Create a new class
export const createClass: any = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id_grade, desc, date, url_vid } = req.body;

        // Validate the input data
        if (!id_grade || !desc || !date || !url_vid) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Create a new class document
        const newClass = new classes({
            id_grade,
            desc,
            date,
            url_vid
        });

        // Save the class document to the database
        await newClass.save();

        return res.status(201).json({ newClass, msg: 'Class created successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Error creating class', error });
    }
};


// Get all classes by grade
export const getClassesByGrade: any = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Find all classes with the specified grade ID
        const classesList = await classes.find({ id_grade:id });

        if (classesList.length === 0) {
            return res.status(404).json({ msg: 'No classes found for this grade' });
        }

        return res.status(200).json(classesList);
    } catch (error) {
        return res.status(500).json({ msg: 'Error retrieving classes', error });
    }
};


// Delete a class
export const deleteClass: any = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Find and delete the class by ID
        const deletedClass = await classes.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        return res.status(200).json({ msg: 'Class deleted successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Error deleting class', error });
    }
};