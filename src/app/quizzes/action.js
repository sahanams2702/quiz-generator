import axios from "axios";

export async function getQuizzes() {

    const quizzes = await axios.get("/api/quizzes");
    console.log(quizzes);
    return quizzes.data;
}

export async function getQuestions(id) {
    const questions = await axios.get(`api/questions/quiz/${id}`);
    console.log(questions);
    return questions.data;
}