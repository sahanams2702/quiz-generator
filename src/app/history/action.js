import axios from "axios";

export async function getQuizzes() {
    const id = await axios.get('/api/auth/user').then(res => res.data.userId);
    console.log(id);
    const quizzes = await axios.get(`api/quizzes/users/${id}`);
    console.log(quizzes);
    return quizzes.data;
}

export async function getQuestions(id) {
    const questions = await axios.get(`api/questions/quiz/${id}`);
    console.log(questions);
    return questions.data;
}