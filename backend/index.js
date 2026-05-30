import express from 'express';
import cors from 'cors';
import { extractIntent } from './endpoint/intentExtraction.js';
import { getUnifiedResult } from './endpoint/getUnifiedResult.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// FIXED FOR SECURITY & CORS
app.use(cors({
    origin: 'https://your-frontend-app.vercel.app', // Replace with your actual Vercel URL later
    credentials: true
}));

app.post('/getHolidayOptions', extractIntent, getUnifiedResult);

// FIXED FOR RENDER: Always listen on a port in production
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// You can keep or remove the export line, Render will ignore it
export default app;