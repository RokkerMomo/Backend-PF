"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
const special_controller_1 = require("../controllers/special.controller");
const grade_controller_1 = require("../controllers/grade.controller");
const user_controller_1 = require("../controllers/user.controller");
function isAdmin(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, function (err, user) {
        if (err || !user) {
            return res.status(401).json({
                'status': 401,
                'code': 2,
                'message': 'You are not authenticated.',
            });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({
                'status': 403,
                'code': 1,
                'message': 'No eres Administrador de la pagina'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}
router.get("/special", passport_1.default.authenticate("jwt", { session: false }), special_controller_1.special);
router.post('/NewGrade', passport_1.default.authenticate('jwt', { session: false }), isAdmin, grade_controller_1.NewGrade);
router.post('/signup', passport_1.default.authenticate("jwt", { session: false }), isAdmin, user_controller_1.signUp);
router.get('/getGradesTable', passport_1.default.authenticate('jwt', { session: false }), isAdmin, grade_controller_1.getGradesTable);
router.get('/getUsersWithRoleUser', passport_1.default.authenticate('jwt', { session: false }), isAdmin, user_controller_1.getUsersWithRoleUser);
router.get('/getUserById/:id', passport_1.default.authenticate('jwt', { session: false }), isAdmin, user_controller_1.getUserById);
router.put("/updateGrade/:id", passport_1.default.authenticate('jwt', { session: false }), isAdmin, grade_controller_1.updateGrade);
router.put("/updateUser/:id", passport_1.default.authenticate('jwt', { session: false }), isAdmin, user_controller_1.updateUser);
router.delete("/DeleteGrade/:id", passport_1.default.authenticate('jwt', { session: false }), isAdmin, grade_controller_1.deleteGrade);
router.delete("/deleteUser/:id", passport_1.default.authenticate('jwt', { session: false }), isAdmin, user_controller_1.deleteUser);
exports.default = router;
