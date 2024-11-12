import endpoint from "./endpoints";

async function addPointToBack(x, y, organid, description, name) {
    try {
        const response = await fetch(`https://${endpoint}/v1/points/add`, {
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
        console.log('Point added successfully:', result);
        return result;
    } catch (error) {
        console.error('Error adding point:', error.message);
    }
}

export { addPointToBack };