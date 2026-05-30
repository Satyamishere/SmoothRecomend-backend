import express from 'express';
import cors from 'cors';
import {extractIntent} from './endpoint/intentExtraction.js';
import {getUnifiedResult} from './endpoint/getUnifiedResult.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Allow your eventual frontend Vercel URL
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // We will add production URL here later
    credentials: true
}));

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