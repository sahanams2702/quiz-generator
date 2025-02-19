import axios from "axios";

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post("/api/auth/login", credentials, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return { error: "Login failed" };
    }
};