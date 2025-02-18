import axios from "axios";

export async function getNumberOfUsers() {
    const res = await axios.get("/api/users");
    const count = res.data.length;
    return count;
}


export async function getNumberOfQuizzes() {
    const res = await axios.get("/api/quizzes");
    const count = res.data.length;
    return count;
}
