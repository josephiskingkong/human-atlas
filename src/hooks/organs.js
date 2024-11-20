import { ENDPOINT } from "../config/constants";

async function addOrgan(formData) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/organs/add`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add organ');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding organ:', error.message);
    }
}

async function getOrganByOrganId(organid) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/organs/get/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch organs');
        }

        const organ = await response.json();
        return organ;
    } catch (error) {
        console.error('Error fetching organ by organ ID:', error.message);
    }
}

async function getOrgansByCategoryId(organid) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/organs/get-by-categoryid/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch organs');
        }

        const organs = await response.json();
        return organs;
    } catch (error) {
        console.error('Error fetching organ by organs ID:', error.message);
    }
}

export { addOrgan, getOrganByOrganId, getOrgansByCategoryId };