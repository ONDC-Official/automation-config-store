import { SessionData } from "../../../../session-types";

function getRandomStations(data: any) {
  // Flatten all stops across all fulfillments
  const allStops = data.flatMap((fulfillment: any) => fulfillment.stops);

  // Get two unique random indices
  let firstIndex = Math.floor(Math.random() * allStops.length);
  let secondIndex: number;

  do {
    secondIndex = Math.floor(Math.random() * allStops.length);
  } while (secondIndex === firstIndex); // Ensure the indices are different

  // Return the randomly selected stops
  return {
    start_station: allStops[firstIndex].location.descriptor.code,
    end_station: allStops[secondIndex].location.descriptor.code,
  };
}

export async function searchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  const stops = existingPayload.message.intent.fulfillment.stops;
  stops[0].location.descriptor.code = "start_station";
  stops[1].location.descriptor.code = "end_station";
  return existingPayload;
}
