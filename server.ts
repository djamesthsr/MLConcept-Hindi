import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Endpoint: Generate immersive Scientist Briefing
app.post("/api/generate-brief", async (req, res) => {
  try {
    const { userName, language } = req.body;
    const ai = getAI();
    const name = userName || "Agent Scientist";
    const isHi = language === "hi";

    let prompt = `You are the Director of the AI Innovation Research Lab. Write a highly engaging, scientific, and motivating mission briefing for our newly appointed Machine Learning Scientist: ${name}.
The theme is "Machine Learning Concepts" (Module 4).
Cover the following exciting aspects:
- Congratulate them on joining the AI Lab.
- Introduce the quest: We are investigating how machines learn through real-world datasets, AI simulations, and feedback.
- Briefly mention the three Lab doors they will investigate: Supervised Learning (labeled examples), Unsupervised Learning (finding hidden structures), and Reinforcement Learning (trial and error with rewards).
- Keep the tone immersive, professional, and full of agency (avoiding corporate fluff, focus on raw scientific exploration).
- Format: Keep it to about 3 brief paragraphs. Use structured headings if necessary, but keep it clear and scannable.`;

    if (isHi) {
      prompt += `\nCRITICAL DIRECTIVE: You MUST write the entire output in beautiful, grammatically correct, and scientifically precise Hindi language (हिन्दी भाषा). Use Devanagari script for the output. You may use English words inside parentheses for technical concepts where appropriate, but the main text must be Hindi.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isHi 
          ? "आप एआई इनोवेशन रिसर्च लैब के विस्मयकारी विज्ञान-फाई निदेशक हैं। स्पष्ट, बुद्धिमान और आधिकारिक हिंदी में बात करें।"
          : "You are the immersive sci-fi Director of the AI Innovation Research Lab. Speak with crisp, intelligent authority.",
      }
    });

    res.json({ brief: response.text });
  } catch (error: any) {
    const { language } = req.body;
    const isHi = language === "hi";
    console.warn("Using offline fallback briefing (API denied/unavailable):", error.message);
    res.json({
      brief: isHi 
        ? `### मिशन निर्देश प्राप्त हुआ
एआई इनोवेशन रिसर्च लैब में आपका स्वागत है। हमारे नवनियुक्त मशीन लर्निंग वैज्ञानिक के रूप में, आपको मशीन संज्ञान के मूल मार्गों की जांच करने का काम सौंपा गया है।

हम तीन अलग-अलग प्रयोगशाला क्षेत्रों का पता लगाएंगे:
1. **सुपरवाइज्ड लर्निंग लैब** (चिह्नित परिणामों के साथ संरचित डेटासेट का विश्लेषण करना)
2. **अनसुपरवाइज्ड लर्निंग लैब** (क्लस्टर सेट में छिपे समूहों और पैटर्न की खोज करना)
3. **रीइन्फोर्समेंट लर्निंग अखाड़ा** (परीक्षण, त्रुटि और रणनीतिक फीडबैक लूप का उपयोग करके स्व-अनुकूलन एजेंटों को प्रशिक्षित करना)।

आपका साक्ष्य बोर्ड तैयार है। सक्रिय अंशांकन के लिए तैयार रहें। आइए उन एल्गोरिदम को अनलॉक करें जो हमारी दुनिया को आकार देते हैं।`
        : `### MISSION BRIEF RECEIVED
Welcome to the AI Innovation Research Lab. As our newly appointed Machine Learning Scientist, you are tasked with investigating the core pathways of machine cognition. 

We will explore three distinct laboratory environments:
1. **Supervised Learning Lab** (analyzing structured datasets with labeled outcomes)
2. **Unsupervised Learning Lab** (discovering hidden groups and patterns in cluster sets)
3. **Reinforcement Learning Arena** (training self-optimizing agents using trial, error, and strategic feedback loops).

Your evidence board is prepared. Stand by for active calibration. Let us unlock the algorithms that shape our world.`,
      error: error.message
    });
  }
});

// AI Endpoint: Adaptive mentor feedback on specific decisions or essays
app.post("/api/mentor-feedback", async (req, res) => {
  try {
    const { activity, data, language } = req.body;
    const ai = getAI();
    const isHi = language === "hi";

    let prompt = "";
    if (activity === "investigation") {
      prompt = `Review the ML Consultant decisions made by the student.
Organization: ${data.org}
Problem Description: ${data.problem}
Student's Recommended Approach: ${data.choice} (Correct Answer is: ${data.correctAnswer})

Provide immediate, engaging feedback from an expert AI Research Mentor.
Explain WHY this choice is correct or incorrect in a friendly, pedagogical, yet highly scientific way.
If correct, praise their technical judgment. If incorrect, kindly explain the difference (e.g. why Supervised fits labels while Unsupervised fits grouping without labels) and guide them to understand the right concept.
Keep it under 3-4 sentences.`;
    } else if (activity === "reflection") {
      prompt = `Review this student's short essay answers regarding Machine Learning:
Question: ${data.question}
Student's Response: "${data.response}"

Provide a brief, encouraging, and intellectually engaging feedback comment from an AI Research Mentor. 
Validate their thoughts, make a scientific connection to their response, and motivate them to keep exploring. Keep it to 2-3 sentences max.`;
    } else {
      res.status(400).json({ error: "Invalid activity type" });
      return;
    }

    if (isHi) {
      prompt += `\nCRITICAL DIRECTIVE: You MUST write the response in beautiful, grammatically correct Hindi language (हिन्दी भाषा). Keep the expert technical concepts clear using Devanagari script.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isHi 
          ? "आप मुख्य एआई रिसर्च मेंटर हैं। आपका स्वर सहायक, अकादमिक रूप से कठोर और प्रेरणादायक हिंदी में है।"
          : "You are the chief AI Research Mentor. Your tone is supportive, academically rigorous, and inspiring.",
      }
    });

    res.json({ feedback: response.text });
  } catch (error: any) {
    const { language } = req.body;
    const isHi = language === "hi";
    console.warn("Using offline fallback mentor feedback:", error.message);
    res.json({
      feedback: isHi 
        ? "आपका विश्लेषणात्मक दृष्टिकोण सराहनीय है, वैज्ञानिक। डेटा पैटर्न बताते हैं कि आपका तर्क आधुनिक मशीन लर्निंग प्रतिमानों के साथ अच्छी तरह से संरेखित है। अपने मॉडल को कैलिब्रेट करना जारी रखें।"
        : "Your analytical approach is noted, Scientist. Data patterns show that your logic is well-aligned with modern machine learning paradigms. Continue calibrating your models.",
      error: error.message
    });
  }
});

// AI Endpoint: Personalized Mission Report
app.post("/api/mission-report", async (req, res) => {
  const { userName, score, answers, reflection, language } = req.body;
  const isHi = language === "hi";
  try {
    const ai = getAI();

    let prompt = `Generate a personalized, comprehensive, and highly encouraging AI Research Lab Report for ML Scientist: ${userName || "Student"}.
Here are the student's metrics from their Module 4 activities:
- Knowledge Check Score: ${score}%
- Performance in ML Consultant investigation: 100% completed
- Dataset Detective Drag & Drop: Completed
- Workflow Arrangement challenge: Completed
- Reflective responses provided for the Machine Learning Journey.

Write a custom feedback summary (3 paragraphs) that:
1. Highlights their key strengths (e.g., strong reasoning, excellent analytical abilities, or a great grasp of reinforcement learning based on their answers).
2. Recommends one primary Machine Learning concept they should revisit or deepen their understanding of before moving on to Module 5 (the AI Project Cycle).
3. Concludes with an inspiring congratulatory statement about unlocking their 🧠 Machine Learning Scientist badge.
Ensure the tone is scientific, warm, professional, and personalized. Make it feel like a real evaluation from the Director of the AI Lab.`;

    if (isHi) {
      prompt += `\nCRITICAL DIRECTIVE: You MUST write this entire lab report in beautiful, grammatically correct Hindi language (हिन्दी भाषा). Use Devanagari script. Keep headers and bullet points aligned.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isHi 
          ? "आप एआई इनोवेशन रिसर्च लैब के निदेशक हैं। कस्टम प्रोत्साहन, स्पष्टता और बौद्धिक रूप से परिष्कृत हिंदी में बात करें।"
          : "You are the Director of the AI Innovation Research Lab. Speak with custom encouragement, clarity, and intellectual polish.",
      }
    });

    res.json({ report: response.text });
  } catch (error: any) {
    console.warn("Using offline fallback mission report:", error.message);
    res.json({
      report: isHi 
        ? `### व्यक्तिगत लैब मूल्यांकन
**सेवा में:** एमएल वैज्ञानिक ${userName || "नाम"}  
**स्थिति:** प्रमाणित एमएल वैज्ञानिक  

सभी नैदानिक ​​मॉड्यूल में आपका प्रदर्शन मशीन लर्निंग अवधारणाओं की एक मजबूत पकड़ को दर्शाता है। आपने डेटा वर्गीकरण और परामर्श मॉडलिंग में उत्कृष्ट क्षमता का प्रदर्शन करते हुए सुपरवाइज्ड, अनसुपरवाइज्ड और रीइन्फोर्समेंट लर्निंग वातावरण को सफलतापूर्वक नेविगेट किया।

**कैलिब्रेशन का अनुशंसित क्षेत्र:** मॉड्यूल 5 (एआई प्रोजेक्ट चक्र) पर शुरू करने से पहले, हम अनसुपरवाइज्ड क्लस्टरिंग (Unsupervised Clustering) की सटीक सीमाओं की समीक्षा करने की सलाह देते हैं ताकि आपके आर्किटेक्चरल चयन कौशल को और अधिक निखारा जा सके।

आपको **🧠 मशीन लर्निंग वैज्ञानिक बैज** अनलॉक करने और 120 XP सुरक्षित करने पर बहुत-बहुत बधाई। आपकी विशेषज्ञता हमारी रिसर्च लैब के लिए एक अत्यंत महत्वपूर्ण संपत्ति है।`
        : `### PERSONALIZED LAB EVALUATION
**To:** ML Scientist ${userName || "Name"}  
**Status:** Certified ML Scientist  

Your performance across all diagnostic modules indicates a robust grasp of machine learning concepts. You successfully navigated the Supervised, Unsupervised, and Reinforcement Learning environments, demonstrating excellent capacity in data categorization and consultive modeling.

**Recommended Area of Calibration:** Prior to embarking on Module 5 (the AI Project Cycle), we recommend reviewing the precise boundaries of Unsupervised Clustering as it applies to real-time marketing segmentation, to further refine your architectural selection skills.

Congratulations on unlocking the **🧠 Machine Learning Scientist Badge** and securing 120 XP. Your expertise is a vital asset to our Research Lab.`,
      error: error.message
    });
  }
});

// Setup Vite Dev Server / Static Assets Serving
const initServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
};

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
