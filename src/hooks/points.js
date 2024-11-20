import { ENDPOINT } from "../config/constants";

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

async function deletePointById(id) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/points/delete`, {
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
        console.error('Error deleting point:', error.message);
    }
}

async function editPoint(point) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/points/edit`, {
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
        return result;
    } catch (error) {
        console.error('Error editing point:', error.message);
    }
}

async function getPointsByOrganId(organid) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/points/get-by-organid/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch points');
        }

        const points = await response.json();
        return points;
    } catch (error) {
        console.error('Error fetching points by organ ID:', error.message);
    }
}

async function getPointById(id) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/points/get/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch point');
        }

        const point = await response.json();
        return point;
    } catch (error) {
        console.error('Error fetching point by ID:', error.message);
    }
}

export { addPointToBack, deletePointById, editPoint, getPointById, getPointsByOrganId };