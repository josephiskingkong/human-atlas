import { apiRequest } from "../../config/apiRequest";

async function addPointToBack(x, y, organid, description, name) {
    try {
        const response = await apiRequest(`/v1/points/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x, y, organid, name, description })
        });

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error adding point:', error.message);
    }
}

export { addPointToBack };