async function getPointsByOrganId(organid) {
    try {
        const response = await fetch(`https://api.humanatlas.top/v1/points/get-by-organid/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch points');
        }

        const points = await response.json();
        console.log('Points data:', points);
        return points;
    } catch (error) {
        console.error('Error fetching points by organ ID:', error.message);
    }
}

async function getPointById(id) {
    try {
        const response = await fetch(`https://humanatlas.top/v1/points/get/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch point');
        }

        const point = await response.json();
        console.log('Point data:', point);
        return point;
    } catch (error) {
        console.error('Error fetching point by ID:', error.message);
    }
}

export { getPointsByOrganId, getPointById };