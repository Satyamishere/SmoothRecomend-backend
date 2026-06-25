// endpoint/getUnifiedResult.js

import { hotels, destinations, flights as mockFlights } from '../mockData/mockdata.js';
import { activities } from '../mockData/activitiesWithEmbeddings.js';
import { searchFlights } from '../services/tektravelsService.js';

// Canonical city normalization helper
function normalizeCity(raw) {
  if (!raw && raw !== "") return "";
  const s = String(raw).trim().toLowerCase();

  const canonicalMap = {
    banglore: 'bangalore',
    bengaluru: 'bangalore',
    bengalore: 'bangalore',
    bombay: 'mumbai',
    mum: 'mumbai'
  };

  return canonicalMap[s] || s;
}

function CosineSimilarity(A, B) {
  let sumofsquaresA = 0;
  let sumofsquaresB = 0;
  let dotProduct = 0;

  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    sumofsquaresA += A[i] * A[i];
    sumofsquaresB += B[i] * B[i];
  }

  const magnitudeA = Math.sqrt(sumofsquaresA);
  const magnitudeB = Math.sqrt(sumofsquaresB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

function computeWeights(intent) {
  const priorities = {
    budget: 0,
    connectivity: 0,
    activity: 0,
    flight: 1,
    hotel: 1
  };

  const constraintMap = {
    hard: 3,
    optimize: 2,
    soft: 1,
    null: 0,
    undefined: 0
  };

  if (intent.budget) {
    priorities.budget =
      constraintMap[intent.budget.constraint_type] || 0;
  }

  if (intent.connectivity) {
    priorities.connectivity =
      constraintMap[intent.connectivity.constraint_type] || 0;
  }

  if (intent.interests && intent.interests.length > 0) {
    const maxInterestPriority = Math.max(
      ...intent.interests.map(
        i => constraintMap[i.constraint_type] || 0
      )
    );

    priorities.activity = maxInterestPriority;
  }

  const totalPriority = Object.values(priorities).reduce(
    (sum, p) => sum + p,
    0
  );

  if (totalPriority === 0) {
    return {
      budget: 0.2,
      flight: 0.2,
      hotel: 0.2,
      connectivity: 0.2,
      activity: 0.2
    };
  }

  return {
    budget: priorities.budget / totalPriority,
    flight: priorities.flight / totalPriority,
    hotel: priorities.hotel / totalPriority,
    connectivity: priorities.connectivity / totalPriority,
    activity: priorities.activity / totalPriority
  };
}

function computeBudgetScore(totalCost, maxBudget) {
  if (!maxBudget) {
    return 50;
  }

  const budgetScore =
    100 - (totalCost / maxBudget) * 100;

  return Math.max(0, Math.min(100, budgetScore));
}

function computeFlightScore(flight) {
  let score = 0;

  if (flight.stops === 0) {
    score = 100;
  }
  else if (flight.stops === 1) {
    score = 60;
  }
  else if (flight.stops === 2) {
    score = 30;
  }
  else {
    score = 0;
  }

  const flightHour =
    parseInt((flight.time || '').split(':')[0]) || 0;

  if (flightHour >= 21 || flightHour <= 5) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

function computeHotelScore(hotel) {
  return Math.max(
    0,
    Math.min(100, (hotel.rating / 5) * 100)
  );
}

function computeConnectivityScore(hotel, connectivity) {
  if (!connectivity) {
    return 50;
  }

  if (
    connectivity.value === "nearMetro" &&
    hotel.nearMetro
  ) {
    return 100;
  }

  if (
    connectivity.value === "nearMetro" &&
    !hotel.nearMetro
  ) {
    return 30;
  }

  return 50;
}

export async function getUnifiedResult(req, res) {

  const intent = req.body;
  console.log("you have reached till this line 158");

  if (!intent) {
    return res.status(400).json({
      status: 400,
      error: "Empty intent in request body."
    });
  }


  let ranking_of_activities_similarity = [];

  for (const activity of activities) {

    const similarity = CosineSimilarity(
      activity.embedding,
      intent.interests_embedding
    );

    ranking_of_activities_similarity.push({
      activity,
      similarity
    });
  }

  ranking_of_activities_similarity.sort(
    (a, b) => b.similarity - a.similarity
  );

  const filtered_activities =
    ranking_of_activities_similarity.slice(0, 6);

  const valid_destinations = new Set(
    filtered_activities.map(a => normalizeCity(a.activity.location))
  );

  console.log("\nTop matched activities:\n");

  for (const item of filtered_activities) {

    console.log(
      `${item.activity.name} | ${item.activity.location} | ${item.similarity.toFixed(4)}`
    );
  }


  const duration = intent.duration_days || 3;

  const weights = computeWeights(intent);



  let flights;

  try {

    flights = await searchFlights(intent);

    if (!flights || flights.length === 0) {
      throw new Error("no flights returned");
    }

  } catch (error) {

    console.error(
      "Flight API failed, using mock flights"
    );

    flights = mockFlights;
  }


  const results = [];

  for (const flight of flights) {
    // Flight-level debug log
    console.log({ flightAirline: flight.airline, flightPrice: flight.price, flightStops: flight.stops, flightTime: flight.time, flightConstraints: intent.flight });

    for (const hotel of hotels) {
      let destinationList = [];

      const hotelCityRaw = hotel.city;
      const normalizedHotelCity = normalizeCity(hotelCityRaw);
      console.log({ hotelCityRaw, normalizedHotelCity });

      // Prefer textual city provided by intentExtraction (intent.destination_city).
      const rawIntentDestination = intent.destination_city || intent.destination || "";
      if (rawIntentDestination) {
        destinationList = String(rawIntentDestination)
          .toLowerCase()
          .split(/\s+or\s+|\s+and\s+|,/) 
          .map(x => x.trim())
          .filter(x => x.length > 0);
      }

      
      const normalizedDestinationList = destinationList.map(d => normalizeCity(d));

      // Destination matching log
      const destinationMatch = normalizedDestinationList.length > 0
        ? normalizedDestinationList.includes(normalizedHotelCity)
        : (valid_destinations.size === 0 ? true : valid_destinations.has(normalizedHotelCity));

      console.log({
        destinationList,
        hotelCity: hotel.city,
        normalizedDestinationList,
        normalizedHotelCity,
        destinationMatch
      });

      if (normalizedDestinationList.length > 0) {
        if (!normalizedDestinationList.includes(normalizedHotelCity)) {
          console.log("REJECTED_DESTINATION", {
            destinationList,
            hotelCity: hotel.city,
            normalizedDestinationList,
            normalizedHotelCity,
            reason: 'explicit destination list does not include hotel city'
          });
          continue;
        }
      } else {
        if (valid_destinations.size > 0 && !valid_destinations.has(normalizedHotelCity)) {
          console.log("REJECTED_DESTINATION", {
            valid_destinations: Array.from(valid_destinations),
            hotelCity: hotel.city,
            normalizedHotelCity,
            reason: 'no matching activities in this destination'
          });
          continue;
        }
      }


      const hotelCost =
        hotel.pricePerNight * duration;

      let totalCost =
        flight.price + hotelCost;


      let destinationActivities =
        ranking_of_activities_similarity
          .filter(x => normalizeCity(x.activity.location) === normalizedHotelCity)
          .sort(
            (a, b) => b.similarity - a.similarity
          )
          .slice(0, 3);

      let matchedActivities =
        destinationActivities.map(x => x.activity);


      // Activity filtering logs
      const matchedActivityNames = matchedActivities.map(a => a.name);
      console.log({
        matchedActivityNames,
        matchedActivitiesCount: matchedActivities.length,
        topDestinationActivities: destinationActivities.map(d => ({
          name: d.activity.name,
          location: d.activity.location,
          normalizedLocation: normalizeCity(d.activity.location),
          similarity: d.similarity
        }))
      });

      if (intent.interests && intent.interests.some(i => i.constraint_type === "hard") && matchedActivities.length === 0) {
        console.log("REJECTED_ACTIVITY", {
          requiredInterests: intent.interests,
          matchedActivityNames,
          reason: 'hard interest constraints had no matching activities in this destination'
        });
        continue;
      }

      console.log("reached line 287");
      const activityCost =
        matchedActivities.reduce(
          (sum, act) => sum + act.price,
          0
        );

      totalCost += activityCost;

      // hard constraints check - if any hard constraint is violated, skip this option

      // Budget filtering log
      console.log({ totalCost, budgetLimit: intent.budget?.max, budgetConstraint: intent.budget?.constraint_type });
      if (intent.budget?.constraint_type === "hard" && intent.budget?.max && totalCost > intent.budget.max) {
        console.log("REJECTED_BUDGET", { totalCost, budgetLimit: intent.budget.max, reason: 'totalCost exceeds hard budget limit' });
        continue;
      }

      // Connectivity filtering log
      console.log({ connectivityConstraint: intent.connectivity, hotelNearMetro: hotel.nearMetro });
      if (intent.connectivity?.constraint_type === "hard" && intent.connectivity?.value === "nearMetro" && !hotel.nearMetro) {
        console.log("REJECTED_CONNECTIVITY", { hotel: hotel.name, hotelCity: hotel.city, reason: 'hotel not near metro while hard connectivity required' });
        continue;
      }


      const budgetScore =
        computeBudgetScore(
          totalCost,
          intent.budget?.max
        );

      const flightScore =
        computeFlightScore(flight);

      const hotelScore =
        computeHotelScore(hotel);

      const connectivityScore =
        computeConnectivityScore(
          hotel,
          intent.connectivity
        );
        console.log("reached line 322")
      // embedding-based activity score
      let activityScore = 50;

      if (destinationActivities.length > 0) {

        const avgSimilarity =
          destinationActivities.reduce(
            (sum, item) => sum + item.similarity,
            0
          ) / destinationActivities.length;

        activityScore = avgSimilarity * 100;
      }


      const finalScore =
        weights.budget * budgetScore +
        weights.flight * flightScore +
        weights.hotel * hotelScore +
        weights.connectivity * connectivityScore +
        weights.activity * activityScore;

      const displayScore =
        Math.max(
          40,
          Math.min(95, Math.round(finalScore))
        );


      // Log accepted trip details before adding
      console.log("TRIP_ACCEPTED", {
        destination: hotel.city,
        hotel: hotel.name,
        activities: matchedActivities.map(a => a.name),
        totalCost: Math.round(totalCost)
      });

      results.push({

        id:
          `trip_${flight.airline}_${hotel.name}_${Date.now()}`,

        destination: hotel.city,

        duration,

        totalCost: Math.round(totalCost),

        breakdown: {
          flight: flight.price,
          hotel: hotelCost,
          activities: activityCost
        },

        score: displayScore,

        flight: {
          airline: flight.airline,
          price: flight.price,
          stops: flight.stops,
          time: flight.time
        },

        hotel: {
          name: hotel.name,
          pricePerNight: hotel.pricePerNight,
          rating: hotel.rating,
          nearMetro: hotel.nearMetro,
          image: hotel.image
        },

        activities: matchedActivities.map(act => ({
          name: act.name,
          tags: act.tags,
          price: act.price
        }))
      });
    }
  }

console.log("reached line 405")
  results.sort((a, b) => b.score - a.score);

  // ensurig diversity in top results by limiting to max 2 trips per destination

  const topResults = [];

  const destinationCount = {};

  for (const trip of results) {

    if (!destinationCount[trip.destination]) {
      destinationCount[trip.destination] = 0;
    }

    // max 2 trips per destination
    if (destinationCount[trip.destination] >= 2) {
      continue;
    }

    topResults.push(trip);

    destinationCount[trip.destination]++;

    if (topResults.length === 6) {
      break;
    }
  }

  console.log(
    `Generated ${results.length} total trips`
  );

  console.log(
    `Returning ${topResults.length} diverse trips`
  );

  res.json({

    status: 200,

    query: {
      destination: intent.destination,
      duration,
      budget:
        intent.budget?.max
          ? `₹${intent.budget.max}`
          : "Not specified",

      interests:
        intent.interests?.map(i => i.type) || []
    },

    trips: topResults,

    totalOptions: results.length
  });
}