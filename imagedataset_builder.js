const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log("API Key Loaded:", process.env.API_KEY); // Debug only

const groq = new Groq({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.groq.com'
});

async function convertText_prompt(userPrompt) {
  if (!userPrompt) throw new Error("Prompt is required");

  try {
    console.log("Sending text prompt to Groq...");
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "" },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    });
    console.log("Text response received.");
    return response.choices[0].message.content.trim();
  } catch (err) {
    throw new Error(`Text prompt error: ${err.message}`);
  }
}

async function convertImage_prompt(textPrompt, imagePath, accuracy = null, datasetSize = null, greyscale = null, strength = null) {
  if (!textPrompt || !imagePath) throw new Error("Text and image path are required");

  // fallback to random if not provided
  accuracy = accuracy ?? Math.floor(Math.random() * 11);
  datasetSize = datasetSize ?? Math.floor(Math.random() * 11);
  greyscale = greyscale ?? false;
  strength = strength ?? Math.floor(Math.random() * 11);

  try {
    console.log("Reading and encoding image...");
    const imageData = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageData.toString('base64')}`;

    const relevanceCheckPrompt = `Does the image match or relate to this prompt: "${textPrompt}"? Reply with only "yes" or "no".`;

    console.log("Checking relevance...");
    const relevanceCheck = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: relevanceCheckPrompt },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      temperature: 0,
      max_completion_tokens: 10
    });

    const isRelated = relevanceCheck.choices[0].message.content.trim().toLowerCase().includes("yes");

    if (!isRelated) {
      throw new Error("Image and prompt are not related.");
    }

    console.log("Relevance confirmed. Sending image + prompt to Groq...");

    const fullPrompt = `Using the image and the prompt, write exactly one sentence with 10 words that describes both together. Prompt: "${textPrompt}"`;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: fullPrompt },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 100,
      top_p: 1,
      stream: false
    });

    const sentence = response.choices[0].message.content.trim();
    console.log("Image response received.");

    // Save output to file
    const imageName = path.basename(imagePath, path.extname(imagePath)); // e.g. sampleimage
    const fileName = `temp${imageName}Query.txt`; // e.g. tempSampleimageQuery.txt
    const output = `${sentence} | ${accuracy} | ${datasetSize} | ${greyscale} | ${strength}`;

    fs.writeFileSync(fileName, output, 'utf8');
    console.log(`Saved to file: ${fileName}`);

    return sentence;
  } catch (err) {
    throw new Error(`Image prompt error: ${err.message}`);
  }
}

// TEMP: Hardcoded test runner
if (require.main === module) {
  const imagePrompt = "more Scraper images";
  const imagePath = "./sampleimage.jpg";

  convertImage_prompt(imagePrompt, imagePath, 6, 9, true, 4)
    .then(result => console.log("10-word Description:\n", result))
    .catch(err => console.error("Image Error:", err.message));
}

module.exports = { convertText_prompt, convertImage_prompt };
