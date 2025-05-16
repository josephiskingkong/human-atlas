import { apiRequest } from "../../config/apiRequest";

async function deletePointById(id) {
    try {
        const response = await apiRequest(`/v1/points/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (response.error) {
            throw new Error(response.error || 'Failed to add point');
        }

        return response;
    } catch (error) {
        console.error('Error deleting point:', error.message);
    }
}

export { deletePointById };