import axios from "axios";

export async function createQuiz(quiz) {
    const res = await axios.post("/api/quizzes", quiz);
    return res.data;
}

