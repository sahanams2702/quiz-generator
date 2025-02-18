import axios from "axios";

export const generatePDFAPI = async (pdfData) => {
  
    console.log("formData in generate form service:", pdfData);
  try {
    const response = await axios.post("/api/generatepdfapi", pdfData, {
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
