import { apiRequest } from "../../config/apiRequest";

async function getTests() {
    try {
        const response = await apiRequest(`/v1/tests`);

        if (response.error) {
            throw new Error(response.error || 'Failed to get tests');
        }

        return response;
    } catch (error) {
        console.error('Error fetching tests:', error.message);
    }
}

export { getTests };