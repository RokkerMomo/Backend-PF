import { Router } from "express";
import passport from "passport";

const router = Router();

import { special } from "../controllers/special.controller";
import { NewGrade } from "../controllers/grade.controller";

// Middleware to check if the user is an admin
import { Request, Response, NextFunction } from "express";

function isAdmin(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", { session: false }, function (err: Error, user: any) {
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

router.get(
  "/special",
  passport.authenticate("jwt", { session: false }),
  special
);

// router.post('/NewGrade', passport.authenticate('jwt', { session: false }), NewGrade);

router.post('/NewGrade', passport.authenticate('jwt', { session: false }), isAdmin, NewGrade);

export default router;