import { ENDPOINT } from "../../config/constants";

async function editPoint(point) {
    try {
        const response = await fetch(`https://${ENDPOINT}/v1/points/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(point)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to edit point');
        }

        const result = await response.json();
        console.log('Point edited successfully:', result);
        return result;
    } catch (error) {
        console.error('Error editing point:', error.message);
    }
}

export { editPoint };