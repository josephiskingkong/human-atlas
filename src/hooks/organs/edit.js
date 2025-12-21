import { apiRequest } from "../../config/apiRequest";

export default async function editSlide(id, name, details, categoryId) {
  const body = {
    name,
    id,
    details,
    categoryId,
  };

  try {
    const response = await apiRequest(`/v1/organs/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return response;
  } catch (error) {
    console.error("Error editting slide:", error.message);
    return null;
  }
}
