import app from './app'
import './database';

app.listen(app.get('port'));
console.log(`the mongouri is ${process.env.MONGODB_URI} Listening on http://localhost:${app.get('port')}`);