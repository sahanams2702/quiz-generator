import axios from "axios";

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`/api/users/update/${userId}`, userData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Update user error:", error.response?.data || error.message);
        return { error: "Update user failed" };
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`/api/users/delete/${userId}`, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Delete user error:", error.response?.data || error.message);
        return { error: "Delete user failed" };
    }
}
