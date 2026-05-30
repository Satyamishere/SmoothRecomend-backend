import express from 'express';
import cors from 'cors';
import {extractIntent} from './endpoint/intentExtraction.js';
import {getUnifiedResult} from './endpoint/getUnifiedResult.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// List of allowed origins
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://smooth-recomend-frontend.vercel.app' // Your live frontend URL
];

// Explicit dynamic CORS handling
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman, mobile apps, or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express wildcard route to catch and pass preflight OPTIONS checks cleanly
app.options('*', cors());

app.post('/getHolidayOptions', extractIntent, getUnifiedResult);

// ONLY listen on port when running locally (Vercel bypasses this)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 6000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// CRITICAL FOR VERCEL
export default app;