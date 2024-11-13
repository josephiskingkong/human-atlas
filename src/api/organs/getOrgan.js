import { ENDPOINT } from "../../config/constants";

async function getOrganByOrganId(organid) {
    try {
        console.log("GET ORGAN");
        const response = await fetch(`https://${ENDPOINT}/v1/organs/get/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch organs');
        }

        const organ = await response.json();
        console.log('Organ data:', organ);
        return organ;
    } catch (error) {
        console.error('Error fetching organ by organ ID:', error.message);
    }
}

async function getOrgansByCategoryId(organid) {
    try {
        console.log("GET ORGANS");
        const response = await fetch(`https://${ENDPOINT}/v1/organs/get-by-categoryid/${organid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch organs');
        }

        const organs = await response.json();
        console.log('Organs data:', organs);
        return organs;
    } catch (error) {
        console.error('Error fetching organ by organs ID:', error.message);
    }
}

export { getOrganByOrganId, getOrgansByCategoryId };