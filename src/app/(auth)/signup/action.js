import axios from "axios";

export const signupUser = async (userData) => {
    try {
        const response = await axios.post("/api/auth/signup", userData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Error")
        console.error("Signup error:", error.response?.data || error.message);
        const res = {
            error: "User already exists"
        }
        return res;
    }
};