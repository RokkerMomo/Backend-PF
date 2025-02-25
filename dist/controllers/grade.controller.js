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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGrades = exports.deleteGrade = exports.updateGrade = exports.getGradesTable = exports.getGrade = exports.getGrades = exports.NewGrade = void 0;
const grade_1 = __importDefault(require("../models/grade"));
const hasAccsess_1 = __importDefault(require("../models/hasAccsess"));
const class_1 = __importDefault(require("../models/class"));
const user_1 = __importDefault(require("../models/user"));
//NewGrade
const NewGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.name || !req.body.desc || !req.body.slogan || !req.body.price || !req.body.url_pic || !req.body.vidId) {
        return res.status(400).json({ msg: 'asegurate de ingresar todos los datos' });
    }
    const user = yield grade_1.default.findOne({ name: req.body.name });
    if (user) {
        return res.status(400).json({ msg: 'Ya existe el grado que intentas ingresar' });
    }
    //GUARDAR Grade
    const newUser = new grade_1.default(req.body);
    yield newUser.save();
    return res.status(201).json({ newUser, msg: 'grade registrado correctamente' });
});
exports.NewGrade = NewGrade;
//GET GRADES
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield grade_1.default.find();
    return res.status(200).json(grades);
});
exports.getGrades = getGrades;
// get Grade
const getGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gradeData = yield grade_1.default.findById(req.params.id);
        if (!gradeData) {
            return res.status(404).json({ msg: 'Grade not found' });
        }
        const studentCount = yield hasAccsess_1.default.countDocuments({ id_grade: req.params.id });
        const classCount = yield class_1.default.countDocuments({ id_grade: req.params.id });
        return res.status(200).json(Object.assign(Object.assign({}, gradeData.toObject()), { students: studentCount, classes: classCount }));
    }
    catch (error) {
        console.error('Error retrieving grade:', error);
        return res.status(500).json({ msg: 'Error retrieving grade', error });
    }
});
exports.getGrade = getGrade;
// get Grades Table
const getGradesTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield grade_1.default.find();
    const gradesWithStudents = yield Promise.all(grades.map((grade) => __awaiter(void 0, void 0, void 0, function* () {
        const accessCount = yield hasAccsess_1.default.countDocuments({ id_grade: grade._id });
        return Object.assign(Object.assign({}, grade.toObject()), { students: accessCount });
    })));
    return res.status(200).json(gradesWithStudents);
});
exports.getGradesTable = getGradesTable;
// Update Grade
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { vidId, price } = _a, updateData = __rest(_a, ["vidId", "price"]); // Exclude vidId from the update data
    // Validate that price is a number
    if (price !== undefined && typeof price !== 'number') {
        return res.status(400).json({ msg: 'Price must be a number' });
    }
    // Include price in updateData if it is valid
    if (price !== undefined) {
        updateData.price = price;
    }
    const updatedGrade = yield grade_1.default.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGrade) {
        return res.status(404).json({ msg: 'Grade not found' });
    }
    return res.status(200).json({ updatedGrade, msg: 'Grade updated successfully' });
});
exports.updateGrade = updateGrade;
// Delete Grade
const deleteGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Delete user's access to grades
    yield hasAccsess_1.default.deleteMany({ id_grade: id });
    const deletedGrade = yield grade_1.default.findByIdAndDelete(id);
    if (!deletedGrade) {
        return res.status(404).json({ msg: 'Grade not found' });
    }
    return res.status(200).json({ msg: 'Grade deleted successfully' });
});
exports.deleteGrade = deleteGrade;
// Get User Grades
const getUserGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Fetching grades for user ID: ${id}`);
        // Find the user by ID
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Check if the user is an admin
        if (user.role.toString() === 'admin') {
            const grades = yield grade_1.default.find();
            return res.status(200).json(grades);
        }
        // Find the grades the user has access to
        const accessRecords = yield hasAccsess_1.default.find({ id_user: id });
        console.log(`Access records found: ${accessRecords.length}`);
        if (accessRecords.length === 0) {
            return res.status(404).json({ msg: 'No grades found for this user' });
        }
        const gradeIds = accessRecords.map(record => record.id_grade);
        const grades = yield grade_1.default.find({ _id: { $in: gradeIds } });
        return res.status(200).json(grades);
    }
    catch (error) {
        console.error('Error retrieving user grades:', error);
        return res.status(500).json({ msg: 'Error retrieving user grades', error });
    }
});
exports.getUserGrades = getUserGrades;
