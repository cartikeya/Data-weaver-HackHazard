const { OpenAI } = require('openai');
require('dotenv').config();

console.log("API Key Loaded:", process.env.API_KEY); // Debug only

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

async function convertText(promptInstruction, inputText) {
  if (!promptInstruction || !inputText) {
    throw new Error("Both instruction and text are required");
  }

  try {
    console.log("Sending to Groq...");
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that follows user instructions to transform the given text accordingly."
        },
        {
          role: "user",
          content: `${promptInstruction}\n\n${inputText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });
    console.log("Response received.",response);
    return response.choices[0].message.content.trim();
  } catch (err) {
    throw new Error(`Error converting text: ${err.message}`);
  }
}

// TEMP: Hardcoded input for testing (no CLI args)
if (require.main === module) {
  const instruction = "Convert this text into Shakespearean English";
  const inputText = "Hey bro, what's up? Long time no see.";

  convertText(instruction, inputText)
    .then(result => {
      console.log("Converted Text:\n", result);
    })
    .catch(err => {
      console.error("Error:", err.message);
    });
}

module.exports = convertText;