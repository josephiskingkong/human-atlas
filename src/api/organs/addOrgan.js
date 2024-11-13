import { ENDPOINT } from "../../config/constants";

async function addOrgan(formData) {
    try {
        const response = await fetch(`https://${ENDPOINT}/v1/organs/add`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add organ');
        }

        const result = await response.json();
        console.log('Organ added successfully:', result);xw
        return result;
    } catch (error) {
        console.error('Error adding organ:', error.message);
    }
}

export { addOrgan }