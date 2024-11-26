import { ENDPOINT } from "../../config/constants";

async function addPointToBack(x, y, organid, description, name) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/points/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x, y, organid, name, description })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add point');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding point:', error.message);
    }
}

export { addPointToBack };