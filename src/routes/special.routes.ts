import { Router } from "express";
import passport from "passport";

const router = Router();

import { special } from "../controllers/special.controller";
import { deleteGrade, getGradesTable, getUserGrades, NewGrade, updateGrade } from "../controllers/grade.controller";
import { deleteUser, getUserById, getUsersWithRoleUser, signUp, updateUser } from "../controllers/user.controller";

// Middleware to check if the user is an admin
import { Request, Response, NextFunction } from "express";
import { createClass, deleteClass, getClassesByGrade } from "../controllers/class.controller";

function isAdmin(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", { session: false }, function (err: Error, user: any) {
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




router.get(
  "/special",
  passport.authenticate("jwt", { session: false }),
  special
);


router.get(
  "/getUserGrades/:id",
  passport.authenticate("jwt", { session: false }),
  getUserGrades
);


router.post('/NewGrade', passport.authenticate('jwt', { session: false }), isAdmin, NewGrade);
router.post('/signup', passport.authenticate("jwt", { session: false }), isAdmin, signUp);
router.post('/createClass', passport.authenticate("jwt", { session: false }), isAdmin,createClass)

router.get('/getGradesTable', passport.authenticate('jwt', { session: false }), isAdmin, getGradesTable)
router.get('/getUsersWithRoleUser', passport.authenticate('jwt', { session: false }), isAdmin, getUsersWithRoleUser)
router.get('/getUserById/:id', passport.authenticate('jwt', { session: false }), isAdmin, getUserById)
router.get('/getClassesByGrade/:id', passport.authenticate('jwt', { session: false }),getClassesByGrade)

router.put("/updateGrade/:id", passport.authenticate('jwt', { session: false }), isAdmin, updateGrade);
router.put("/updateUser/:id", passport.authenticate('jwt', { session: false }), isAdmin, updateUser)

router.delete("/DeleteGrade/:id", passport.authenticate('jwt', { session: false }), isAdmin, deleteGrade);
router.delete("/deleteUser/:id", passport.authenticate('jwt', { session: false }), isAdmin, deleteUser)
router.delete('/deleteClass/:id', passport.authenticate('jwt', { session: false }), isAdmin,deleteClass)
export default router;