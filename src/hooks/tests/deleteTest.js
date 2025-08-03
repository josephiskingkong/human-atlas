import { apiRequest } from "../../config/apiRequest";

async function deleteTestById(id) {
  try {
    const response = await apiRequest(`/v1/tests/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.error) {
      throw new Error("Ошибка при удалении теста");
    }

    return response.message === "success";
  } catch (error) {
    throw new Error(`Ошибка при удалении теста: ${error.message}`);
  }
}

export { deleteTestById };
