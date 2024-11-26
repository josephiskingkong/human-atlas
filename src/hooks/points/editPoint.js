import { apiRequest } from "../../config/apiRequest";

async function editPoint(point) {
    try {
        const response = await apiRequest(`/v1/points/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(point)
        });

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error editing point:', error.message);
    }
}

export { editPoint };