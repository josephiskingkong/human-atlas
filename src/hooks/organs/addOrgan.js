import { apiRequest } from "../../config/apiRequest";

async function addOrgan(formData) {
    try {
        const response = await apiRequest(`/v1/organs/add`, {
            method: 'POST',
            body: formData
        });

        if (response.error) {
            throw new Error(response.error || 'Failed to add organ');
        }

        return response;
    } catch (error) {
        console.error('Error adding organ:', error.message);
    }
}

export { addOrgan }