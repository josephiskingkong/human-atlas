import { ENDPOINT } from "../config/constants";

async function getMainCategories() {
    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/get-mains/`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories');
        }

        const categories = await response.json();
        categories.sort((a, b) => a.name.localeCompare(b.name));

        return categories;
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
        return [];
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
        categories.sort((a, b) => a.name.localeCompare(b.name));

        return categories;
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
        return [];
    }
}

async function getCategoryById(id) {
    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/get/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories');
        }

        const category = await response.json();

        return category;
    } catch (error) {
        console.error('Error fetching categories: ', error.message);
        return [];
    }
}

async function addCategory(name, categoryid = null) {
    const body = {
        name,
        categoryid
    };

    const filteredBody = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== null)
    );

    try {
        const response = await fetch(`${ENDPOINT}/v1/categories/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filteredBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add category');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding category:', error.message);
        return null;
    }
}

export { getCategoriesByParentId, getMainCategories, addCategory, getCategoryById };