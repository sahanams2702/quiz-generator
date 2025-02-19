import axios from 'axios';

// Fetch the 5 most recent quizzes
export const getRecentQuizzes = async () => {
  try {
    const response = await axios.get(`/api/quizzes`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching recent quizzes:", error);
    return [];
  }
};

export async function getUsers() {
    try {
      const response = await axios.get(`/api/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
}

export const getUsersSignedUpThisWeek = async () => {
  try {
    const response = await axios.get(`/api/users`);
    const users = response.data;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 
    endOfWeek.setHours(23, 59, 59, 999); 

    const usersThisWeek = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= startOfWeek && createdAt <= endOfWeek;
    });

    return usersThisWeek.length; 
  } catch (error) {
    console.error("Error fetching users signed up this week:", error);
    return 0;
  }
};

export const getUsersPerMonth = async () => {
  try {
    const response = await axios.get(`/api/users`); // Fetch all users
    const users = response.data;

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Initialize an object to count users per month
    const monthlyUserCounts = Array(12).fill(0);

    // Loop through users and count them per month
    users.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      if (createdAt.getFullYear() === currentYear) {
        const monthIndex = createdAt.getMonth(); // 0 for Jan, 1 for Feb, etc.
        monthlyUserCounts[monthIndex]++;
      }
    });

    // Convert to the chart format
    const formattedData = [
      { name: "Jan", Users: monthlyUserCounts[0] },
      { name: "Feb", Users: monthlyUserCounts[1] },
      { name: "Mar", Users: monthlyUserCounts[2] },
      { name: "Apr", Users: monthlyUserCounts[3] },
      { name: "May", Users: monthlyUserCounts[4] },
      { name: "Jun", Users: monthlyUserCounts[5] },
      { name: "Jul", Users: monthlyUserCounts[6] },
      { name: "Aug", Users: monthlyUserCounts[7] },
      { name: "Sep", Users: monthlyUserCounts[8] },
      { name: "Oct", Users: monthlyUserCounts[9] },
      { name: "Nov", Users: monthlyUserCounts[10] },
      { name: "Dec", Users: monthlyUserCounts[11] },
    ];

    return formattedData;
  } catch (error) {
    console.error("Error fetching users per month:", error);
    return [];
  }
};