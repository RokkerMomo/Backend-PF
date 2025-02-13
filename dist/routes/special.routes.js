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
function isAdmin(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, function (err, user) {
        if (err || !user) {
            return res.status(401).json({
                'status': 401,
                'code': 2,
                'message': 'You are not authenticated.',
                'moreInfo': 'https://myawesomeapi.io/docs'
            });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({
                'status': 403,
                'code': 1,
                'message': 'No eres Administrador de la pagina',
                'moreInfo': 'https://myawesomeapi.io/upgrade'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
}
router.get("/special", passport_1.default.authenticate("jwt", { session: false }), special_controller_1.special);
// router.post('/NewGrade', passport.authenticate('jwt', { session: false }), NewGrade);
router.post('/NewGrade', passport_1.default.authenticate('jwt', { session: false }), isAdmin, grade_controller_1.NewGrade);
exports.default = router;
