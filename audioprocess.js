import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config(); // Loads variables from .env into process.env

const groq = new Groq({
  apiKey: process.env.API_KEY // pulls from your .env file
});

/**
 * Translates speech in an audio file using Groq Whisper API
 * @param {string} filePath - Path to the audio file
 * @param {string} prompt - Optional text prompt for context/spelling
 * @returns {Promise<string>} Translated text
 */
async function translateAudio(filePath, prompt = "") {
  try {
    const response = await groq.audio.translations.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      prompt: prompt,
      language: "en",
      response_format: "json",
      temperature: 0.0,
    });

    return response.text;
  } catch (err) {
    console.error("❌ Translation failed:", err.message);
    return null;
  }
}

// Example usage
async function main() {
  const translatedText = await translateAudio("sampleaudiodata.mp3");
  if (translatedText) {
    console.log("📝 Translated Text:", translatedText);
  }
}

main();
