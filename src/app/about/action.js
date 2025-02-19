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


export async function getNumberOfQuestions() {
    const res = await axios.get("/api/quizzes");
    let total = 0;
    for (let i = 0; i < res.data.length; i++) {
        const quiz = res.data[i];
        total += quiz.numberOfQuestions;
    }
    return total;
}