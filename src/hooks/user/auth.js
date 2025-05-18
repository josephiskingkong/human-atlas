import { apiRequest } from "../../config/apiRequest";

export async function userLogin(username, password) {
    const response = await apiRequest("/v1/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    return response;
}

export async function userRegister(username, password, name) {
    const response = await apiRequest("/v1/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            name,
        }),
    });

    return response;
}