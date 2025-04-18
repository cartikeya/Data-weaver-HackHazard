const { OpenAI } = require('openai');
require('dotenv').config();

console.log("API Key Loaded:", process.env.API_KEY); // Debug only

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

async function convertText_prompt(userPrompt) {
  if (!userPrompt) {
    throw new Error("Prompt is required");
  }

  try {
    console.log("Sending to Groq...");
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `Extract structured information from this website content and convert it into a useful JSON format. Only output the raw JSON data. Do not include any explanations, introductions, or extra text.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });
    console.log("Response received.", response);
    return response.choices[0].message.content.trim();
  } catch (err) {
    throw new Error(`Error converting text: ${err.message}`);
  }
}

// TEMP: Hardcoded input for testing (no CLI args)
if (require.main === module) {
  const userPrompt = `Deep work is the ability to focus without distraction on a cognitively demanding task, and it's becoming increasingly important in a world filled with distractions. The concept of deep work has been around for centuries, with thinkers like Antonin-Dalmace Sertillanges recognizing its importance in mastering complicated material. Sertillanges argued that to advance your understanding of a field, you must tackle the relevant topics systematically, allowing your attention to uncover the truth latent in each. This idea is supported by modern research in performance psychology, which has shown that experts in various fields owe their superior performance to a lifetime of deliberate practice. Deliberate practice, as coined by K. Anders Ericsson, refers to the systematic and focused effort to improve performance in a specific domain, and it's the key to quickly learning hard things.

%}-{% 

The benefits of deep work are numerous, and they include the ability to learn quickly, make connections between ideas, and produce high-quality work. When you're able to focus without distraction, you can tap into your mental resources and unlock your full potential. Deep work also allows you to develop a sense of flow, which is the state of complete absorption in an activity. In this state, you're fully engaged, and your skills and abilities are matched by the challenges you're facing. The result is a sense of satisfaction and fulfillment that comes from producing something of value. However, deep work is not easy to achieve, especially in a world filled with distractions like social media, email, and text messages. It requires discipline, motivation, and a willingness to prioritize your goals and values. By making deep work a priority, you can achieve greater success and fulfillment in your personal and professional life.

%}-{% 

To incorporate deep work into your daily routine, you need to create an environment that supports focus and concentration. This means eliminating or minimizing distractions, such as turning off your phone or finding a quiet workspace. You also need to schedule deep work sessions into your calendar, just as you would any other important appointment. During these sessions, you should focus exclusively on the task at hand, without any interruptions or multitasking. Additionally, you need to develop strategies for maintaining your motivation and discipline, such as setting clear goals, tracking your progress, and rewarding yourself for your achievements. By making deep work a habit, you can develop the skills and expertise you need to succeed in your field, and you can achieve a sense of fulfillment and purpose that comes from producing high-quality work. With dedication and persistence, you can overcome the obstacles that stand in your way and achieve your full potential.

%}-{% 

The concept of deep work has been influential in shaping the way we think about productivity, learning, and success. It's been applied in various fields, from business and technology to education and the arts. By recognizing the importance of deep work, individuals and organizations can create an environment that supports focus, creativity, and innovation. This can lead to breakthroughs, discoveries, and achievements that might not have been possible otherwise. Furthermore, deep work can help individuals develop a sense of purpose and meaning, which is essential for a happy and fulfilling life. As the world becomes increasingly complex and distracting, the ability to focus without distraction will become even more valuable. By embracing the principles of deep work, you can stay ahead of the curve and achieve your goals, even in a world filled with distractions and interruptions. With deep work, you can unlock your full potential and achieve greatness.`;

  convertText_prompt_json(userPrompt)
    .then(result => {
      console.log("Converted Text:\n", result);
    })
    .catch(err => {
      console.error("Error:", err.message);
    });
}

module.exports = convertText_prompt;