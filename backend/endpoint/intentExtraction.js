import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { getEmbedding } from "../oneTimeCallFunctions/getembedding.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const WORKING_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant"
];

export async function extractIntent(req, res, next) {
  const text = req.body?.text;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  //console.log(`Extracting intent from: "${text}"`);
  // this part has prompt  for intent extraction
  console.log("before prompt");
  const prompt = `
You are a smart travel assistant. Extract travel intent from the user's natural language query.

Your task is to identify explicit locations, constraints (budget, connectivity, duration) and,
when possible, infer the user's underlying mood or vibe (e.g. "relaxing", "adventurous", "celebrating").
Do **not** assign a destination based solely on mood – the mood value will be used later in the pipeline to
match appropriate activities or destinations.

User Query: "${text}"

INSTRUCTIONS:
1. If the user mentions a specific place (Goa, Delhi, Kerala, etc.) → use that as the destination.
2. If the user expresses a mood/feeling WITHOUT naming a place, **only** infer a mood value (do **not** suggest a destination). Examples:
   - "peaceful/calm/relaxation" → mood "relaxation" or "peaceful"
   - "adventure/thrill" → mood "adventure"
   - "romantic/couple" → mood "romantic"
   - "beach/coastal" → mood "relaxation"
   - "party/nightlife" → mood "celebration"
   - "promotion" or "celebrate" → mood "celebration"
   - "spiritual/religious" → mood "spiritual"
   - "nature/mountains" → mood "nature"
   - "culture/heritage" → mood "culture"
3. Always populate the "mood" field with a descriptive string (or null if none detected).
4. Extract additional "interests" based on activities or words in the query.
5. If duration not mentioned, default to 3 days.
6. If budget not mentioned, leave as null.

Return JSON ONLY with this structure:
{
  "destination": "City Name or null",
  "duration_days": 3,
  "month": "optional month name",
  "budget": {
    "max": number or null,
    "constraint_type": "hard" | "soft" | "optimize" | null
  },
  "connectivity": {
    "value": "nearMetro" | null,
    "constraint_type": "hard" | "soft" | null
  },
  "interests": [
    {"type": "peaceful", "constraint_type": "soft"},
    {"type": "beach", "constraint_type": "soft"}
  ],
  "mood": null
}

EXAMPLES:
Input: "Plan a 3-day trip to Goa under 20k"
Output: {"destination": "Goa", "duration_days": 3, "budget": {"max": 20000, "constraint_type": "hard"}, "connectivity": null, "interests": [], "mood": null}

Input: "I'm feeling peaceful"
Output: {"destination": null, "duration_days": 3, "budget": null, "connectivity": null, "interests": [{"type": "peaceful", "constraint_type": "soft"}, {"type": "relaxation", "constraint_type": "soft"}], "mood": "relaxation"}

Input: "Just got a promotion, want to celebrate"
Output: {"destination": null, "duration_days": 3, "budget": null, "connectivity": null, "interests": [{"type": "celebration", "constraint_type": "soft"}], "mood": "celebration"}

Now extract from: "${text}"
Return ONLY valid JSON.
`;

  for (const model of WORKING_MODELS) {
    // we will later add mood detection post-processing using textLower
    try {
      console.log(`Trying model: ${model}`);

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a travel intent extraction AI. Return ONLY valid JSON. No explanations, no markdown."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const generated = response.choices[0].message.content;

      // Parse the JSON
      let jsonStr = generated.trim();

      // Clean markdown if present
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }

      const intent = JSON.parse(jsonStr);

      // make lowercase copy early for any text checks
      const textLower = text.toLowerCase();

      // Post-processing: ensure proper structure
      if (Array.isArray(intent.interests)) {
        intent.interests = intent.interests.map(item => {
          if (typeof item === 'string') {
            return {
              type: item,
              constraint_type: "soft"
            };
          }
          return item;
        });
      }

      // Set defaults for missing fields
      if (!intent.budget) intent.budget = { max: null, constraint_type: null };
      if (!intent.connectivity) intent.connectivity = { value: null, constraint_type: null };
      if (!intent.interests) intent.interests = [];
      if (!intent.duration_days) intent.duration_days = 3;

      // special-case word 'promotion' as celebration/party mood
      if (textLower.includes('promotion')) {
        // mood field explicitly for logging/behaviour
        intent.mood = 'celebration';
        // set a party/celebration interest for backward compatibility
        intent.interests.push({ type: 'celebration', constraint_type: 'soft' });

        // additional basic mood keywords
        const moodMap = {
          relax: 'relaxation',
          relaxed: 'relaxation',
          relaxation: 'relaxation',
          chill: 'relaxation',
          peaceful: 'peaceful',
          nature: 'nature',
          adventurous: 'adventure',
          adventure: 'adventure',
          thrill: 'adventure',
          romantic: 'romantic',
          celebration: 'celebration',
          party: 'celebration',
          promotion: 'celebration',
          culture: 'culture',
          history: 'culture',
          exposure: 'culture',
          spiritual: 'spiritual',
          religious: 'spiritual'
        };
        for (const key of Object.keys(moodMap)) {
          if (textLower.includes(key) && !intent.mood) {
            intent.mood = moodMap[key];
            break;
          }
        }
      }
      const embeddingInput = `
      ${text}
      ${intent.mood || ""}
      ${intent.interests.map(interests => interests.type).join(" ")}
      `;
      intent.interests_embedding = await getEmbedding(embeddingInput);

      // simple regex to capture origin city and departure date
      const fromMatch = textLower.match(/from\s+([A-Za-z]+)/i);
      const toMatch = textLower.match(/to\s+([A-Za-z]+)/i);
      if (fromMatch) intent.origin = fromMatch[1];
      if (toMatch) intent.destination = toMatch[1]; // override if NLP missed
      // drop nonsensical destinations that are just filler words
      if (intent.destination) {
        const bad = ['visit', 'place', 'somewhere', 'destination', 'anywhere'];
        if (bad.includes(intent.destination.toLowerCase())) {
          intent.destination = null;
        }
      }

      // map common city names to IATA codes and uppercase everything
      const iataMap = {
        delhi: 'DEL',
        mumbai: 'BOM',
        mumbay: 'BOM',
        bangalore: 'BLR',
        bengaluru: 'BLR',
        chennai: 'MAA',
        hyderabad: 'HYD',
        kolkata: 'CCU',
        jaipur: 'JAI',
        goa: 'GOI'
      };
      if (intent.origin) {
        const key = intent.origin.toLowerCase();
        intent.origin_iata = iataMap[key] || intent.origin.toUpperCase();
        intent.origin_city = key;
      }
      if (intent.destination) {
        const originalDest = intent.destination;
        const key = String(intent.destination).toLowerCase();
        // preserve original textual city for downstream matching
        intent.destination_city = key;
        // set IATA code (or uppercase original if not found)
        intent.destination_iata = iataMap[key] || String(intent.destination).toUpperCase();
        // keep legacy `destination` field as the IATA code for services that expect it
        intent.destination = intent.destination_iata;
      }

      const dateMatch = textLower.match(/on\s+(\d{1,2})\s+([A-Za-z]+)/i);
      if (dateMatch) {
        // construct simple YYYY-MM-DD using month name and year from today
        const day = dateMatch[1].padStart(2, '0');
        const monthName = dateMatch[2];
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1;
        const year = new Date().getFullYear();
        intent.departure_date = `${year}-${monthIndex.toString().padStart(2, '0')}-${day}`;
      }








      //console.log(`Extracted Intent:`, JSON.stringify(intent, null, 2));

      req.body = intent;
      return next();

    } catch (err) {
      console.log(`${model} failed:`, err.message);
    }
  }

  res.status(500).json({
    error: "Intent extraction failed",
    details: "All Groq API models failed"
  });
}