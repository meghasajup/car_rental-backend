import express from 'express';
import { connectDB } from './config/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from './routes/index.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// API routes
app.use('/api', apiRouter);


app.all('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint does not exist' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});