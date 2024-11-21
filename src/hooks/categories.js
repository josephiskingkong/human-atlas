import { ENDPOINT } from "../config/constants";

async function getMainCategories() {
    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/get-mains/`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories');
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
    }
}

async function getCategoriesByParentId(categoryid) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/get-by-categoryid/${categoryid}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories');
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
    }
}

async function addCategory(name, categoryid = null) {
    const body = {
        name,
        categoryid
    }

    const filteredBody = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== null)
    );

    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: filteredBody
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add category');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding category:', error.message);
    }
}

module.exports = { getCategoriesByParentId, getMainCategories, addCategory }