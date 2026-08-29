import simpleRest from "@refinedev/simple-rest";
import { config } from "../config";

/**
 * REST data provider pointed at the marvels-api admin surface
 * (`/api/v1/admin/*`). Auth headers are attached in Phase 5 once the JWT
 * flow lands; simple-rest is the starting contract.
 */
export const dataProvider = simpleRest(config.adminApiUrl);
