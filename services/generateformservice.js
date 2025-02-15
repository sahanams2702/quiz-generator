import axios from "axios";

export const generateTextAPI = async (formData) => {
  
    console.log("formData in generate form service:", formData);
  try {
    const response = await axios.post("/api/generateformapi", formData, {
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
