import axios from "axios";

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`/api/users/${userId}`, userData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Update user error:", error.response?.data || error.message);
        return { error: "Update user failed" };
    }
};