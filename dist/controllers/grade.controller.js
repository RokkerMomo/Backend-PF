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
exports.getGrade = exports.getGrades = exports.NewGrade = void 0;
const grade_1 = __importDefault(require("../models/grade"));
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
//get Grade
const getGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grades = yield grade_1.default.findById(req.params.id);
    return res.status(200).json(grades);
});
exports.getGrade = getGrade;
