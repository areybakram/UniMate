const axios = require('axios');

const API_KEY = "AIzaSyA1goTp5EUOpjc6-S3dk8Purv5AGJUNcmQ";
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
  try {
    const response = await axios.get(URL);
    console.log("Available Models:");
    response.data.models.forEach(model => {
      console.log(`- ${model.name} (Supports: ${model.supportedGenerationMethods.join(', ')})`);
    });
  } catch (error) {
    console.error("Error listing models:", error.response?.data || error.message);
  }
}

listModels();
