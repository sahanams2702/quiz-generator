import axios from "axios";

export const generateTopicAPI = async (textData) => {
  
    console.log("formData in generate form service:", textData);
  try {
    const response = await axios.post("/api/generateTextAPI", textData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
    console.log("Response from generateTextAPI:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
