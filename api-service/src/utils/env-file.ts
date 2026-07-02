import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const createEnvFile = async (domain: string, version: string) => {
	const env = `DOMAIN="${domain}"
VERSION="${version}"
NODE_ENV="${process.env.NODE_ENV}"
PORT="${process.env.PORT}"
SIGN_PRIVATE_KEY="${process.env.SIGN_PRIVATE_KEY}"
SIGN_PUBLIC_KEY="${process.env.SIGN_PUBLIC_KEY}"
SUBSCRIBER_ID="${process.env.SUBSCRIBER_ID}"
UKID="${process.env.UKID}"
SUBSCRIBER_URL="${process.env.SUBSCRIBER_URL}"
REDIS_USERNAME="${process.env.REDIS_USERNAME}"
REDIS_HOST="${process.env.REDIS_HOST}"
REDIS_PASSWORD="${process.env.REDIS_PASSWORD}"
REDIS_PORT="${process.env.REDIS_PORT}"
MOCK_SERVER_URL="${process.env.MOCK_SERVER_URL}"
DATA_BASE_URL="${process.env.DATA_BASE_URL}"
CONFIG_SERVICE_URL="${process.env.CONFIG_SERVICE_URL}"
SERVICE_NAME="${process.env.SERVICE_NAME}"
TRACE_URL="${process.env.TRACE_URL}"
`;
	writeFileSync(path.resolve(__dirname, "../../generated/.env"), env);
};
