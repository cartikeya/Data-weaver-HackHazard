const AdmZip = require('adm-zip');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

const calculateExpectedParagraphs = (datasetSize) => {
  const parsed = parseInt(datasetSize);
  return Math.max(3, Math.round((parsed / 10) * 47) + 3); // from 3 to 50
};

async function generateMoreParagraphs(prompt, countNeeded) {
  let paragraphs = [];

  while (paragraphs.length < countNeeded) {
    console.log(`Generating more... (${paragraphs.length}/${countNeeded})`);
    const res = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      //pls put the input as <prompt> + <Vocabulary Richness> + <Dataset Size> + <Strength> + <Entry Length>
      messages: [
        {
          role: "system",
          content: `You are a highly accurate dataset generation model. Generate ONLY raw paragraphs based on the user's input. Each paragraph should be separated using this exact marker: %}-%{% . No intros, no formatting, no titles. Just plain paragraphs.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3500
    });

    const raw = res.choices[0].message.content.trim();
    const newParagraphs = raw.split('%}-%{%').map(p => p.trim()).filter(p => p.length > 0);
    paragraphs = paragraphs.concat(newParagraphs);

    if (newParagraphs.length === 0) break; // prevent infinite loops
  }

  return paragraphs.slice(0, countNeeded); // just in case it overshoots
}

async function convertText_prompt(userPrompt) {
  if (!userPrompt) throw new Error("Prompt is required");

  try {
    const match = userPrompt.match(/<Dataset Size>\s*(\d+)/i);
    const datasetSizeValue = match ? match[1] : "5";
    const totalNeeded = calculateExpectedParagraphs(datasetSizeValue);

    console.log(`Target: ${totalNeeded} paragraphs based on Dataset Size ${datasetSizeValue}`);

    const paragraphs = await generateMoreParagraphs(userPrompt, totalNeeded);

    // Folder cleanup and write
    const OUTPUT_DIR = path.join(process.cwd(), 'output_dataset');
    if (fs.existsSync(OUTPUT_DIR)) fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(OUTPUT_DIR);

    paragraphs.forEach((para, i) => {
      fs.writeFileSync(path.join(OUTPUT_DIR, `para_${i + 1}.txt`), para, 'utf-8');
    });
    
    console.log(`✅ Saved ${paragraphs.length} paragraphs to ./output_dataset/`);
    
    // ✅ Create ZIP after saving text files
    const zip = new AdmZip();
    zip.addLocalFolder(OUTPUT_DIR);
    const zipDir = path.join(process.cwd(), 'public/output_dataset');
    if (!fs.existsSync(zipDir)) fs.mkdirSync(zipDir, { recursive: true });
    const zipPath = path.join(zipDir, 'my_file.zip');
    zip.writeZip(zipPath);
    console.log(`📦 Zipped dataset saved to ${zipPath}`);
    
    return paragraphs.join('\n\n%}-%{%');
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}

// TEMP: Manual run for testing
if (require.main === module) {
  const userPrompt = `the talking style of a pirate  
<Vocabulary Richness> 7  
<Dataset Size> 10  
<Strength> 8  
<Entry Length> 10`;

  convertText_prompt(userPrompt)
    .then(() => console.log("Done."))
    .catch(err => console.error("Error:", err.message));
}

module.exports = convertText_prompt;
