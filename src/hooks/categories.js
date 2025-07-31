import { apiRequest } from "../config/apiRequest";
async function getMainCategories() {
  try {
    const response = await apiRequest(`/v1/categories/get-mains/`);

    response.sort((a, b) => a.name.localeCompare(b.name));

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}

async function getCategoriesByParentId(categoryid) {
  try {
    console.log("CATEGORY_ID", categoryid);

    const response = await apiRequest(
      `/v1/categories/get-by-categoryid/${categoryid}`
    );

    response.sort((a, b) => a.name.localeCompare(b.name));

    return response;
  } catch (error) {
    console.error("Error fetching categories: ", error.message);
    return [];
  }
}

async function getCategoryById(id) {
  try {
    const response = await apiRequest(`/v1/categories/get/${id}`);

    return response;
  } catch (error) {
    console.error("Error fetching categories: ", error.message);
    return [];
  }
}

async function addCategory(name, categoryid = null) {
  const body = {
    name,
    categoryid,
  };

  const filteredBody = Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== null)
  );

  try {
    const response = await apiRequest(`/v1/categories/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredBody),
    });

    return response;
  } catch (error) {
    console.error("Error adding category:", error.message);
    return null;
  }
}

export {
  getCategoriesByParentId,
  getMainCategories,
  addCategory,
  getCategoryById,
};
