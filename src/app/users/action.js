import axios from "axios";

export async function getUsersWithQuizCount() {
  try {
    // Fetch all users
    const usersResponse = await axios.get("/api/users");
    const users = usersResponse.data;

    // Fetch quizzes for each user and attach quiz count
    const usersWithQuizCount = await Promise.all(
      users.map(async (user) => {
        try {
            
          const quizzesResponse = await axios.get(`/api/quizzes/users/${user.id}`);
          const quizCount = quizzesResponse.data.length; // Count the number of quizzes
          return { ...user, quizCount }; // Attach quizCount to user
        } catch (error) {
          console.error(`Error fetching quizzes for user ${user.id}:`, error);
          return { ...user, quizCount: 0 }; // Default to 0 quizzes on error
        }
      })
    );

    return usersWithQuizCount;
  } catch (error) {
    console.error("Error fetching users with quiz count:", error);
    return [];
  }
}


export async function deleteUser(id) {
    try {
        await axios.delete(`/api/users/${id}`);
        return {"success": true}
    }
    catch (error) {
        console.error('Error deleting user:', error);
        return {"success": false}
    }
}