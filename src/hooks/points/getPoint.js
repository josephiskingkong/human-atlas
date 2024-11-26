import { apiRequest } from "../../config/apiRequest";
import { ENDPOINT } from "../../config/constants";

async function getPointsByOrganId(organid) {
    try {
        const response = await apiRequest(`/v1/points/get-by-organid/${organid}`);

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error fetching points by organ ID:', error.message);
    }
}

async function getPointById(id) {
    try {
        const response = await apiRequest(`/v1/points/get/${id}`);

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error fetching point by ID:', error.message);
    }
}

export { getPointsByOrganId, getPointById };