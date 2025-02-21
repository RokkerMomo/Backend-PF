"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.getClassesByGrade = exports.createClass = void 0;
const class_1 = __importDefault(require("../models/class"));
// Create a new class
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_grade, desc, date, url_vid } = req.body;
        // Validate the input data
        if (!id_grade || !desc || !date || !url_vid) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }
        // Create a new class document
        const newClass = new class_1.default({
            id_grade,
            desc,
            date,
            url_vid
        });
        // Save the class document to the database
        yield newClass.save();
        return res.status(201).json({ newClass, msg: 'Class created successfully' });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error creating class', error });
    }
});
exports.createClass = createClass;
// Get all classes by grade
const getClassesByGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_grade } = req.params;
        // Find all classes with the specified grade ID
        const classesList = yield class_1.default.find({ id_grade });
        if (classesList.length === 0) {
            return res.status(404).json({ msg: 'No classes found for this grade' });
        }
        return res.status(200).json(classesList);
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error retrieving classes', error });
    }
});
exports.getClassesByGrade = getClassesByGrade;
// Delete a class
const deleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find and delete the class by ID
        const deletedClass = yield class_1.default.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ msg: 'Class not found' });
        }
        return res.status(200).json({ msg: 'Class deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error deleting class', error });
    }
});
exports.deleteClass = deleteClass;
