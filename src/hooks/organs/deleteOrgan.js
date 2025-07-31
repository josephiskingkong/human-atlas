import { apiRequest } from "../../config/apiRequest";

async function deleteOrganById(id) {
  try {
    const response = await apiRequest(`/v1/organs/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.error) {
      throw new Error("Failed to delete point");
    }

    return response.message === "success";
  } catch (error) {
    throw new Error("Error deleting organ:", error.message);
  }
}

export { deleteOrganById };
