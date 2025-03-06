import { HEY_API_URL } from "@hey/data/constants";
import type { Permission } from "@hey/types/hey";
import axios from "axios";

export const GET_ALL_PERMISSIONS_QUERY_KEY = "getAllPermissions";

/**
 * Retrieves all permissions.
 *
 * @param {any} headers - The authentication headers.
 * @returns {Promise<Permission[]>} A promise that resolves to an array of permissions.
 */
const getAllPermissions = async (headers: any): Promise<Permission[]> => {
  const { data } = await axios.get(`${HEY_API_URL}/internal/permissions/all`, {
    headers
  });

  return data?.result || [];
};

export default getAllPermissions;
