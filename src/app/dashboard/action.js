import axios from "axios";

export async function getQuizzes() {
    const idObj = await axios.get("/api/auth/user");
    const id = idObj.data.userId;
    console.log(id);
    const quizzes = await axios.get(`/api/quizzes/users/${id}`);
    return quizzes.data;
}