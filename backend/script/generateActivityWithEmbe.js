import fs from "fs";
import { activities } from "../mockData/mockdata.js";
import { getEmbedding } from "../oneTimeCallFunctions/getembedding.js";

for(const activity of activities){

  const combinedText = `
    ${activity.name}
    ${activity.description}
    ${activity.tags.join(" ")}
    ${activity.moods ? activity.moods.join(" ") : ""}
  `;

  activity.embedding = await getEmbedding(combinedText);
}

const fileContent = `
export const activities = ${JSON.stringify(activities, null, 2)};
`;

fs.writeFileSync(
  "../mockData/activitiesWithEmbeddings.js",
  fileContent
);

console.log("saved");