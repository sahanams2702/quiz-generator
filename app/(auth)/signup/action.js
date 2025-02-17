import axios from "axios";

export const signupUser = async (userData) => {
    try {
        const response = await axios.post("/api/auth/signup", userData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        return { error: "Signup failed" };
    }
};
