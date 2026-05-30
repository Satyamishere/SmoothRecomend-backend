import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const duffelConfig = {
  apiKey: process.env.DUFFEL_API_KEY,
  baseUrl: process.env.DUFFEL_BASE_URL || "https://api.duffel.com",
  version: process.env.DUFFEL_VERSION || "v2"
};

async function login() {
  if (!duffelConfig.apiKey) {
    throw new Error("Missing DUFFEL_API_KEY in .env");
  }
  return duffelConfig.apiKey;
}

function normalizeFlights(rawOffers) {
  const results = [];

  rawOffers.forEach(offer => {
    const slice = offer?.slices?.[0];
    const segment = slice?.segments?.[0];

    if (!segment) return;

    const departureTime = segment.departing_at || '';
    const timeOnly = departureTime.split('T')[1]?.substring(0,5) || '';
    results.push({
      airline: offer.owner?.name || '',
      price: offer.total_amount || 0,
      currency: offer.total_currency || '',
      stops: slice.segments.length - 1,
      departure: departureTime,
      arrival: segment.arriving_at,
      duration: slice.duration,
      time: timeOnly
    });
  });

  return results;
}

async function searchFlights(intent) {
  if (!intent?.origin || !intent?.destination) {
    return [];
  }

  if (!intent.departure_date) {
    const today = new Date();
    intent.departure_date = today.toISOString().split('T')[0];
  }

  const apiKey = await login();

  const payload = {
    data: {
      slices: [
        {
          origin: intent.origin,
          destination: intent.destination,
          departure_date: intent.departure_date
        }
      ],
      passengers: [{ type: "adult" }],
      cabin_class: "economy"
    }
  };

  try {
    const resp = await axios.post(
      `${duffelConfig.baseUrl}/air/offer_requests`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Duffel-Version": duffelConfig.version,
          "Content-Type": "application/json"
        }
      }
    );

    const offers = resp.data?.data?.offers || [];
    const normalized = normalizeFlights(offers);
    return normalized;

  } catch (err) {
    return [];
  }
}

export { searchFlights, login };