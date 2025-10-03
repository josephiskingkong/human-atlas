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

async function editCategory(categoryId, name, id) {
  const body = {
    name,
    id,
    categoryId,
  };

  try {
    const response = await apiRequest(`/v1/categories/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.error("Error editting category:", error.message);
    return null;
  }
}

async function deleteCategoryById(id) {
  try {
    const response = await apiRequest(`/v1/categories/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.error) {
      throw new Error("Failed to delete category");
    }

    return response.message === "success";
  } catch (error) {
    throw new Error("Error deleting category:", error.message);
  }
}

export {
  getCategoriesByParentId,
  getMainCategories,
  addCategory,
  editCategory,
  deleteCategoryById,
  getCategoryById,
};
