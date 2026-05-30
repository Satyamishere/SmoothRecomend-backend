import express from 'express';
import cors from 'cors';
import {extractIntent} from './endpoint/intentExtraction.js';
import {getUnifiedResult} from './endpoint/getUnifiedResult.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Explicitly match your local and live production websites
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://smooth-recomend-frontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Safe check for missing origins (like Vercel self-pings or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(null, false); // Block quietly instead of throwing a container crash error
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Clean preflight handler
app.options('*', cors());

app.post('/getHolidayOptions', extractIntent, getUnifiedResult);

// ONLY listen on port when running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 6000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// CRITICAL FOR VERCEL
export default app;