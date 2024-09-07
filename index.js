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
app.use(cors({
    origin: 'https://caristacarrental.vercel.app',
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());


// API routes
app.use('/api', apiRouter);

app.get("/",(req, res)=>{
    res.send("Welcome to Carista Car Rental API")
})

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint does not exist' });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});