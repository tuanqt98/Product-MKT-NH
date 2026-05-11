const API_KEY = "AIzaSyDp_dLf3CR9ySFADw8gd_qfxRnJrqpiAVg";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
