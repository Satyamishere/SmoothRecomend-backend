import express from 'express';
import cors from 'cors';
import {extractIntent} from './endpoint/intentExtraction.js';
import {getUnifiedResult} from './endpoint/getUnifiedResult.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// 1. NATIVE VERCEL-SAFE CORS MIDDLEWARE
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://smooth-recomend-frontend.vercel.app'
    ];
    
    const origin = req.headers.origin;
    
    // If the request origin matches our allowed list, set the header dynamically
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Instantly handle preflight OPTIONS checks
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

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