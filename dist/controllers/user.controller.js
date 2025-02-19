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
exports.getUserById = exports.getUsersWithRoleUser = exports.signIn = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const grade_1 = __importDefault(require("../models/grade"));
const hasAccsess_1 = __importDefault(require("../models/hasAccsess"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, usuario: user.email }, config_1.default.jwtSecret, {
        expiresIn: 86400
    });
}
//REGISTRO
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.document || !req.body.class) {
        return res.status(400).json({ msg: 'Make sure you enter all the data' });
    }
    const user = yield user_1.default.findOne({ usuario: req.body.email });
    if (user) {
        return res.status(400).json({ msg: 'The User you entered already exists' });
    }
    //GUARDAR USUARIO
    const newUser = new user_1.default(req.body);
    yield newUser.save();
    for (let index = 0; index < req.body.class.length; index++) {
        const newHasAccess = new hasAccsess_1.default({
            id_user: newUser._id,
            id_grade: req.body.class[index],
        });
        yield newHasAccess.save();
    }
    return res.status(201).json({ newUser, msg: 'Correctly Registered User' });
});
exports.signUp = signUp;
//LOGIN
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ msg: "Please. Send your email and password" });
    }
    const user = yield user_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: "The User does not exists" });
    }
    const isMatch = yield user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user), role: user.role, name: user.name, email: user.email, document: user.document });
    }
    return res.status(400).json({
        msg: "The email or password are incorrect"
    });
});
exports.signIn = signIn;
// Get Users with Role "user"
const getUsersWithRoleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({ role: 'user' });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error retrieving users', error });
    }
});
exports.getUsersWithRoleUser = getUsersWithRoleUser;
// Get User by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Find the grades the user has access to
        const accessRecords = yield hasAccsess_1.default.find({ id_user: id });
        const gradeIds = accessRecords.map(record => record.id_grade);
        const grades = yield grade_1.default.find({ _id: { $in: gradeIds } });
        return res.status(200).json({ user, grades });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Error retrieving user', error });
    }
});
exports.getUserById = getUserById;
