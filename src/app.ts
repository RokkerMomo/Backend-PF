import express from 'express'
import passport from 'passport'
import passportMiddleware from './middlewares/passport';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/aut.routes';
import specialRoutes from './routes/special.routes';

const app = express();

// settings
app.set('port', process.env.PORT || 5173);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

app.get('/', (req:any, res:any) => {
  return res.send(`the mongouri is ${process.env.MONGODB_URI} The API is at http://localhost:${app.get('port')}`);
})

app.use(authRoutes);
app.use(specialRoutes);

export default app;