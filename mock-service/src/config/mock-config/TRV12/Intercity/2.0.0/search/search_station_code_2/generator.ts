import { SessionData } from "../../../../session-types";

export async function searchGenerator(
  existingPayload: any,
  sessionData: SessionData
) {
  delete existingPayload.context.bpp_uri;
  delete existingPayload.context.bpp_id;
  existingPayload.context.location.city.code = sessionData.city_code;
  existingPayload.message.intent.fulfillment = sessionData.fulfillment;
  existingPayload.message.intent.fulfillment.vehicle = {
    category: "BUS",
  };
  existingPayload.message.intent.fulfillment.stops.forEach((stop: any) => {
    let time = {
      label: "DATE_OF_JOURNEY",
      timestamp: getCurrentTime(),
    };
    if (stop.type === "START") {
      stop.time = time;
      if (stop.location?.descriptor) {
        stop.location.descriptor.name = getStationName(stop.location.descriptor.code);
      }
    }
  });
  existingPayload.message.intent.fulfillment.stops.push({
    type: "END",
    location: {
      descriptor: {
        code: sessionData.end_code,
        name: getStationName(sessionData.end_code),
      },
    },
  });
  return existingPayload;
}

function getStationName(code: string): string {
  const baseCode = code.split("-")[0];
  const mapping: Record<string, string> = {
    "std:080": "Bangalore",
    "std:040": "Hyderabad",
    "std:011": "Delhi",
    "std:022": "Mumbai",
    "std:033": "Kolkata",
    "std:044": "Chennai",
    "std:079": "Ahmedabad",
    "std:020": "Pune",
    "std:0522": "Lucknow",
    "std:0141": "Jaipur",
    "std:0712": "Nagpur",
    "std:0512": "Kanpur",
    "std:0261": "Surat",
    "std:0755": "Bhopal",
    "std:0612": "Patna",
    "std:0124": "Gurgaon",
    "std:0120": "Noida",
    "std:0172": "Chandigarh",
    "std:0731": "Indore",
    "std:0265": "Vadodara",
    "std:0891": "Visakhapatnam",
    "std:0484": "Kochi",
    "std:0471": "Thiruvananthapuram",
    "std:0532": "Prayagraj",
    "std:0253": "Nashik",
    "std:0161": "Ludhiana",
    "std:0181": "Jalandhar",
    "std:0821": "Mysore",
    "std:0824": "Mangalore",
    "std:0422": "Coimbatore",
    "std:0452": "Madurai",
    "std:0866": "Vijayawada",
    "std:0771": "Raipur",
    "std:0651": "Ranchi",
    "std:0361": "Guwahati",
    "std:0191": "Jammu",
    "std:0194": "Srinagar",
    "std:0542": "Varanasi",
    "std:0832": "Goa",
    "std:0291": "Jodhpur",
    "std:02692": "Anand",
    "MOCK_STATION_1": "Bangalore",
    "MOCK_STATION_2": "Hyderabad",
  };
  return mapping[baseCode] || code;
}

function getCurrentTime(): string {
  return new Date().toISOString();
}
