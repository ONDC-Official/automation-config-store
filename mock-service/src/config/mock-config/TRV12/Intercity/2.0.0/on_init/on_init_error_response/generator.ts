// function parseSecondsOnly(durationStr: string) {
//   const regex = /^PT(\d+)S$/; // Only matches "PT<number>S"
//   const match = durationStr.match(regex);

//   if (!match) {
//     throw new Error("Invalid format (only PT#S supported)");
//   }

//   const seconds = parseInt(match[1], 10);

//   // Optional safety clamp (e.g., max 60s)
//   if (seconds > 60) {
//     throw new Error("TTL too large, max 60s allowed");
//   }

//   return seconds * 1000; // milliseconds for setTimeout
// }

export async function initGenerator(existingPayload: any, sessionData: any) {
  if (existingPayload.message) {
    existingPayload.error = existingPayload.message.error;
  }
  // const ttlwait = parseSecondsOnly(existingPayload.context.ttl)
  // await new Promise(r => setTimeout(r, ttlwait));
  const { error, context } = existingPayload;

  return { error, context };
}