import { ENDPOINT } from "../../config/constants";

async function deleteOrganById(id) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/organs/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete point');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting organ:', error.message);
    }
}

export { deleteOrganById };