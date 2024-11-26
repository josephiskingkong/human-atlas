import { apiRequest } from "../../config/apiRequest";

async function getOrganByOrganId(organid) {
    try {
        const response = await apiRequest(`/v1/organs/get/${organid}`);

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error fetching organ by organ ID:', error.message);
    }
}

async function getOrgansByCategoryId(organid) {
    try {
        const response = await apiRequest(`/v1/organs/get-by-categoryid/${organid}`);

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error fetching organ by organs ID:', error.message);
    }
}

export { getOrganByOrganId, getOrgansByCategoryId };