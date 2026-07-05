import React, { useState } from "react";
import { 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  Brain, 
  LayoutGrid, 
  GitFork, 
  Zap, 
  Mail, 
  Users, 
  Flame, 
  Lock
} from "lucide-react";

interface LearningLabProps {
  labCompleted: boolean;
  knowledgeCheckCompleted: boolean;
  knowledgeCheckScore: number;
  onCompleteLab: () => void;
  onCompleteKnowledgeCheck: (score: number) => void;
  onNavigate: (tab: string) => void;
  language?: "en" | "hi";
}

export default function LearningLab({ 
  labCompleted, 
  knowledgeCheckCompleted, 
  knowledgeCheckScore, 
  onCompleteLab, 
  onCompleteKnowledgeCheck,
  onNavigate,
  language = "hi"
}: LearningLabProps) {
  
  const [activeDoor, setActiveDoor] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideAnswers, setSlideAnswers] = useState<Record<number, string>>({});
  const [slideFeedback, setSlideFeedback] = useState<Record<number, string>>({});

  // Knowledge Check quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const isHi = language === "hi";

  const t = {
    doorHeader: isHi ? "संज्ञानात्मक प्रयोगशालाएं (Cognitive Labs)" : "Cognitive Laboratories",
    doorDesc: isHi ? "वैज्ञानिक महोदय, आपका स्वागत है। एआई इनोवेशन रिसर्च लैब तीन मुख्य कक्षों में विभाजित है। मशीनें कैसे सीखती हैं, यह जांचने के लिए प्रत्येक द्वार का अन्वेषण करें।" : "Welcome, Scientist. The AI Innovation Research Lab is split into three core chambers. Explore each door to inspect how machines learn.",
    supervisedTitle: isHi ? "सुपरवाइज्ड लर्निंग (Supervised)" : "Supervised Learning",
    supervisedSubtitle: isHi ? "इनपुट-आउटपुट मैप्स // लेबल वाले सेट" : "Input-Output Maps // Labeled sets",
    supervisedDesc: isHi ? "मशीनें पहले से लेबल किए गए ऐतिहासिक उदाहरणों से मैपिंग सूत्र सीखती हैं। स्पैम-फ़िल्टर और निदान के लिए बिल्कुल उपयुक्त।" : "Machines learn mapping formulas from pre-labeled historical examples. Perfect for spam-filters and diagnostics.",
    unsupervisedTitle: isHi ? "अनसुपरवाइज्ड लर्निंग (Unsupervised)" : "Unsupervised Learning",
    unsupervisedSubtitle: isHi ? "क्लस्टर संरचनाएं // कोई लेबल नहीं" : "Cluster Structures // No Labels",
    unsupervisedDesc: isHi ? "एल्गोरिदम स्वतंत्र रूप से प्राकृतिक समूहों और प्रवृत्तियों की खोज करने के लिए सघन बहुआयामी स्थानों की छानबीन करते हैं।" : "Algorithms scour dense multidimensional spaces to discover natural clusters and trends autonomously.",
    reinforcementTitle: isHi ? "रीइन्फोर्समेंट लर्निंग (Reinforcement)" : "Reinforcement Learning",
    reinforcementSubtitle: isHi ? "एजेंट वातावरण // पुरस्कार चक्र (Loops)" : "Agent Environment // Reward Loops",
    reinforcementDesc: isHi ? "एजेंट क्रमिक परीक्षणों के माध्यम से पथ अनुकूलन चाहते हैं, लाइव सिमुलेशन में पुरस्कार या दंड अर्जित करते हैं।" : "Agents seek path optimizations through sequential trials, earning rewards or penalties in live simulations.",
    enterChamber: isHi ? "कक्ष में प्रवेश करें" : "Enter Chamber",
    backToDoors: isHi ? "द्वार चयन पर वापस जाएं" : "Back to Door selection",
    slideIndicator: isHi ? "स्लाइड" : "SLIDE",
    of: isHi ? "का" : "OF",
    evidenceTitle: isHi ? "प्रयोगशाला केस अध्ययन साक्ष्य:" : "LAB CASE STUDY EVIDENCE:",
    submitEvaluation: isHi ? "नैदानिक ​​मूल्यांकन सबमिट करें" : "Submit Diagnostic Evaluation",
    passingScoreNote: isHi ? "कच्चे क्लाइंट डेटासेट का निदान करने से पहले मशीन संज्ञान की अपनी सैद्धांतिक समझ को सत्यापित करें। 80% या उससे अधिक का स्कोर अतिरिक्त क्रेडेंशियल अनलॉक करता है।" : "Verify your theoretical understanding of machine cognition before diagnosing raw client datasets. A passing score of 80% or greater unlocks additional credentials.",
    verificationTitle: isHi ? "वैज्ञानिक ज्ञान जांच" : "Scientist Knowledge Check",
    verificationSub: isHi ? "मॉडल चयन की समझ को कैलिब्रेट करें" : "CALIBRATE MODEL SELECTION COMPREHENSION",
    calibrationScore: isHi ? "अंशांकन स्कोर (Calibration Score)" : "Calibration Score",
    correctLabel: isHi ? "सही" : "Correct",
    passedStatus: isHi ? "स्थिति: सत्यापित! आपने अपने बेसलाइन संज्ञान को सफलतापूर्वक कैलिब्रेट किया है।" : "Status: Verified! You have successfully calibrated your baseline cognition.",
    failedStatus: isHi ? "स्थिति: अंशांकन घाटा। द्वार कक्षों की पुन: जांच करें और उत्तर पुन: सबमिट करें।" : "Status: Calibration deficit. Re-examine the door chambers and submit answers again.",
    recalibrateBtn: isHi ? "पुनः कैलिब्रेट करें (Retry)" : "Recalibrate (Retry)",
    launchScenariosBtn: isHi ? "परामर्श परिदृश्य प्रारंभ करें" : "Launch Consultative Scenarios",
    pleaseAnswerAll: isHi ? "कृपया पहले सभी नैदानिक ​​प्रश्नों के उत्तर दें।" : "Please answer all diagnostic questions first.",
  };

  const slides = [
    {
      title: isHi ? "मशीनें कैसे सीखती हैं" : "How Machines Learn",
      subtitle: isHi ? "तीन मुख्य पथ" : "The Three Core Pathways",
      content: isHi 
        ? "जैसे मनुष्य शिक्षकों, पाठ्यपुस्तकों या परीक्षण और त्रुटि से सीखते हैं, वैसे ही कंप्यूटर तीन अलग-अलग वैज्ञानिक ढांचों के माध्यम से सीखते हैं: सुपरवाइज्ड लर्निंग, अनसुपरवाइज्ड लर्निंग और रीइन्फोर्समेंट लर्निंग। एक मशीन लर्निंग वैज्ञानिक के रूप में, आपको डेटासेट का विश्लेषण करना चाहिए और यह तय करना चाहिए कि एआई को प्रशिक्षित करने के लिए किस पथ का उपयोग किया जाए।"
        : "Just as humans learn from teachers, textbooks, or trial and error, computers learn through three distinct scientific frameworks: Supervised Learning, Unsupervised Learning, and Reinforcement Learning. As a Machine Learning Scientist, you must analyze datasets and decide which pathway to use to train the AI.",
      interactiveType: "intro",
    },
    {
      title: isHi ? "सुपरवाइज्ड लर्निंग लैब" : "Supervised Learning Lab",
      subtitle: isHi ? "लेबल वाले उदाहरणों से सीखना" : "Learning from Labeled Examples",
      content: isHi
        ? "सुपरवाइज्ड लर्निंग एक शिक्षक के साथ सीखने की तरह कार्य करता है। एआई को उनके संबंधित सही लेबल (उत्तर) के साथ इनपुट का एक ऐतिहासिक डेटासेट दिया जाता है। एआई सामान्य सूत्र सीखने के लिए इन लेबल वाले जोड़ों का विश्लेषण करता है। एक बार प्रशिक्षित होने के बाद, यह नए, अनदेखे डेटा के लिए लेबल की भविष्यवाणी कर सकता है।"
        : "Supervised Learning acts like learning with a teacher. The AI is fed a historical dataset of inputs along with their corresponding correct labels (answers). The AI analyzes these labeled pairs to learn the general formula. Once trained, it can predict labels for new, unseen data.",
      scenario: isHi
        ? "स्पैम ईमेल फ़िल्टर: मशीन को हजारों ईमेल खिलाए जाते हैं, जिन्हें इंजीनियरों द्वारा पहले ही 'स्पैम' या 'नॉन-स्पैम' के रूप में चिह्नित किया गया है। यह बाद के ईमेल को वर्गीकृत करने के लिए शब्दावली पैटर्न, प्रेषकों और लेआउट संरचनाओं का विश्लेषण करता है।"
        : "Spam Email Filter: The machine is fed thousands of emails, already flagged by engineers as 'Spam' or 'Not Spam'. It analyzes vocabulary patterns, senders, and layout structures to classify subsequent emails.",
      question: isHi ? "इस एआई को स्पैम पैटर्न सीखने में क्या मदद करता है?" : "What helps this AI learn spam patterns?",
      options: [
        { key: "labeled", text: isHi ? "लेबल वाले ईमेल (वर्गीकृत ईमेल का ऐतिहासिक डेटाबेस)" : "Labeled Emails (e.g. historical database of categorized emails)" },
        { key: "guessing", text: isHi ? "यादृच्छिक अनुमान (परीक्षण-और-त्रुटि वर्गीकरण)" : "Random Guessing (e.g. trial-and-error classification)" },
        { key: "speed", text: isHi ? "उच्च इंटरनेट गति (तेज नेटवर्क प्रोसेसिंग)" : "High Internet Speed (e.g. rapid network processing)" }
      ],
      correctKey: "labeled",
      correctFeedback: isHi 
        ? "सही! सुपरवाइज्ड लर्निंग के लिए अत्यधिक सटीक ऐतिहासिक लेबल आवश्यक हैं। एआई पिछले सही उत्तरों से सीखता है।"
        : "Correct! Highly accurate historical labels are necessary for Supervised Learning. The AI learns from previous correct answers.",
      incorrectFeedback: isHi
        ? "गलत। यादृच्छिक अनुमान अक्षम है, और नेटवर्क की गति प्रशिक्षण तर्क में सहायता नहीं करती है। सुपरवाइज्ड लर्निंग पूरी तरह से लेबल किए गए डेटासेट पर निर्भर करती है।"
        : "Incorrect. Random guessing is inefficient, and network speed doesn't aid training logic. Supervised Learning strictly relies on labeled datasets."
    },
    {
      title: isHi ? "अनसुपरवाइज्ड लर्निंग लैब" : "Unsupervised Learning Lab",
      subtitle: isHi ? "छिपी हुई संरचनाओं की खोज" : "Discovering Hidden Structures",
      content: isHi
        ? "अनसुपरवाइज्ड लर्निंग बिना शिक्षक के सीखने की तरह कार्य करता है। एआई को बिना किसी लेबल या परिणाम के कच्चे, अवर्गीकृत डेटासेट दिए जाते हैं। एल्गोरिथ्म का काम डेटा के आयामों का निरीक्षण करना, छिपी हुई समानताओं को खोजना और उन्हें स्वाभाविक रूप से पैटर्न या समूहों में क्लस्टर करना है।"
        : "Unsupervised Learning acts like learning without a teacher. The AI is given raw, uncategorized datasets with no labels or outcomes. The algorithm's job is to inspect the dimensions of the data, find hidden similarities, and cluster them into patterns or groups naturally.",
      scenario: isHi
        ? "ग्राहक विभाजन (Customer Segmentation): एक रिटेल चेन कच्चे खरीद इतिहास (आवृत्ति, राशि, आइटम प्रकार) को एआई में फीड करती है। सिस्टम बिना किसी मानवीय टैगिंग के समान आदतों वाले खरीदारों के 4 अलग-अलग क्लस्टरों की पहचान करता है।"
        : "Customer Segmentation: A retail chain feeds raw purchasing history (frequency, amount, item types) into the AI. The system identifies 4 separate clusters of shoppers with matching habits (e.g. 'deal-seekers', 'bulk-buyers') without any manual human tagging.",
      question: isHi ? "इस परिदृश्य में अनसुपरवाइज्ड एआई की प्राथमिक क्रिया क्या है?" : "What is the primary action of Unsupervised AI in this scenario?",
      options: [
        { key: "predict", text: isHi ? "भविष्य के मूल्य निर्धारण रुझानों की भविष्यवाणी करना" : "Predict future pricing trends" },
        { key: "groups", text: isHi ? "प्राकृतिक समूह या क्लस्टर खोजना" : "Find natural groups or clusters" },
        { key: "translate", text: isHi ? "ग्राहक उत्पाद समीक्षाओं का अनुवाद करना" : "Translate customer product reviews" }
      ],
      correctKey: "groups",
      correctFeedback: isHi
        ? "सही! अनसुपरवाइज्ड लर्निंग की प्राथमिक शक्ति क्लस्टरिंग है। यह कच्चे, बिना लेबल वाले डेटा में प्राकृतिक विभाजन और छिपे हुए रुझानों की पहचान करता है।"
        : "Correct! The primary power of Unsupervised Learning is clustering. It identifies natural segmentations and hidden trends in raw, unlabelled data.",
      incorrectFeedback: isHi
        ? "गलत। ज्ञात मापदंडों की भविष्यवाणी करना सुपरवाइज्ड है, जबकि अनुवाद एक अलग एनएलपी कार्य है। समूह खोजना अनसुपरवाइज्ड सीखने का मूल है।"
        : "Incorrect. Predicting known parameters is supervised, while translation is a different NLP task. Finding groups is the core of Unsupervised learning."
    },
    {
      title: isHi ? "रीइन्फोर्समेंट लर्निंग अखाड़ा" : "Reinforcement Learning Arena",
      subtitle: isHi ? "पुरस्कार और दंड के माध्यम से अनुकूलन" : "Optimizing through Reward & Penalty",
      content: isHi
        ? "रीइन्फोर्समेंट लर्निंग परीक्षण और त्रुटि सीखने की नकल करती है। एआई (एजेंट) एक सक्रिय वातावरण के साथ बातचीत करता है। यह विभिन्न क्रियाओं का प्रयास करता है, गलतियों के लिए दंड प्राप्त करता है, और सफलता के लिए एक संख्यात्मक 'पुरस्कार' (सकारात्मक प्रतिक्रिया) प्राप्त करता है। यह संचयी पुरस्कारों को अधिकतम करने के लिए रणनीति सीखता है।"
        : "Reinforcement Learning mimics trial-and-error learning. The AI (called an Agent) interacts with an active environment. It tries different actions, receives a penalty for mistakes, and receives a numerical 'reward' (positive feedback) for success. It learns a policy to maximize cumulative rewards.",
      scenario: isHi
        ? "रोबोट वॉकिंग: एक वर्चुअल रोबोट को ट्रैक पर रखा जाता है। वह हजारों छोटे जोड़ों के मूवमेंट की कोशिश करता है। गिरने पर दंड (-10 अंक) मिलता है; 1 मीटर आगे बढ़ने पर पुरस्कार (+100 अंक) मिलता है। समय के साथ, रोबोट खुद को दौड़ना सिखा लेता है।"
        : "Robot Walking: A virtual bipedal robot is placed on a track. It tries thousands of small joint movements. Falling over results in a penalty (-10 points); moving forward 1 meter yields a reward (+100 points). Over time, the robot teaches itself to sprint.",
      question: isHi ? "सुदृढीकरण एआई अपनी चलने की क्षमता में कैसे सुधार करता है?" : "How does the reinforcement AI improve its walking ability?",
      options: [
        { key: "books", text: isHi ? "डिजाइन की किताबें पढ़ना" : "Reading structural design books" },
        { key: "trial", text: isHi ? "परीक्षण और त्रुटि (पुरस्कार और दंड के साथ)" : "Trial and Error (with rewards and penalties)" },
        { key: "memorize", text: isHi ? "पहले से प्रोग्राम किए गए कदमों को याद रखना" : "Memorizing previously programmed footsteps" }
      ],
      correctKey: "trial",
      correctFeedback: isHi
        ? "सही! रीइन्फोर्समेंट लर्निंग परीक्षण-और-त्रुटि प्रतिक्रिया लूप का उपयोग करती है। एजेंट सकारात्मक पुरस्कारों और नकारात्मक दंडों के आधार पर अपनी रणनीति को अनुकूलित करता है।"
        : "Correct! Reinforcement Learning uses trial-and-error feedback loops. The agent optimizes its strategy based on positive rewards and negative penalties.",
      incorrectFeedback: isHi
        ? "गलत। इस गतिशील वातावरण में कोई पहले से लिखित पुस्तकें या कदम नहीं हैं। रीइन्फोर्समेंट पूरी तरह से पर्यावरणीय परीक्षणों पर निर्भर करता है।"
        : "Incorrect. There are no pre-written books or footsteps in this dynamic environment. Reinforcement relies strictly on environmental trials."
    },
    {
      title: isHi ? "तुलनात्मक अनुसंधान मैट्रिक्स" : "Comparative Research Matrix",
      subtitle: isHi ? "एमएल प्रतिमानों का सारांश" : "Summary of ML Paradigms",
      interactiveType: "compare",
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      q: isHi ? "मॉडल को प्रशिक्षित करने के लिए किस मशीन लर्निंग प्रकार को लेबल वाले डेटा की आवश्यकता होती है?" : "Which Machine Learning type requires labeled data to train the model?",
      options: [
        { key: "A", text: isHi ? "अनसुपरवाइज्ड लर्निंग (Unsupervised Learning)" : "Unsupervised Learning" },
        { key: "B", text: isHi ? "सुपरवाइज्ड लर्निंग (Supervised Learning)" : "Supervised Learning" },
        { key: "C", text: isHi ? "रीइन्फोर्समेंट लर्निंग (Reinforcement Learning)" : "Reinforcement Learning" }
      ],
      correct: "B"
    },
    {
      id: 2,
      q: isHi ? "मानवीय श्रेणियों के बिना छिपे हुए पैटर्न खोजने या ग्राहकों को समूहित करने के लिए कौन सा मशीन लर्निंग प्रकार सबसे उपयुक्त है?" : "Which Machine Learning type is best suited for discovering hidden patterns or grouping customers without human categories?",
      options: [
        { key: "A", text: isHi ? "सुपरवाइज्ड लर्निंग" : "Supervised Learning" },
        { key: "B", text: isHi ? "रीइन्फोर्समेंट लर्निंग" : "Reinforcement Learning" },
        { key: "C", text: isHi ? "अनसुपरवाइज्ड लर्निंग" : "Unsupervised Learning" }
      ],
      correct: "C"
    },
    {
      id: 3,
      q: isHi ? "कौन सा मशीन लर्निंग प्रकार सक्रिय पर्यावरणीय संपर्क के माध्यम से एक एजेंट को प्रशिक्षित करने के लिए पुरस्कार और दंड प्रणाली का उपयोग करता है?" : "Which Machine Learning type utilizes a reward and penalty system to train an agent through active environmental interaction?",
      options: [
        { key: "A", text: isHi ? "रीइन्फोर्समेंट लर्निंग" : "Reinforcement Learning" },
        { key: "B", text: isHi ? "सुपरवाइज्ड लर्निंग" : "Supervised Learning" },
        { key: "C", text: isHi ? "अनसुपरवाइज्ड लर्निंग" : "Unsupervised Learning" }
      ],
      correct: "A"
    },
    {
      id: 4,
      q: isHi ? "क्या एक एकल उन्नत एआई प्रणाली जटिल समस्याओं को हल करने के लिए कई सीखने के तरीकों (जैसे सुपरवाइज्ड और रीइन्फोर्समेंट) को जोड़ सकती है?" : "Can a single advanced AI system combine multiple learning methods (e.g. Supervised and Reinforcement) to solve complex problems?",
      options: [
        { key: "A", text: isHi ? "सत्य (उदा. हाइब्रिड सिस्टम)" : "True (e.g. Hybrid systems)" },
        { key: "B", text: isHi ? "असत्य (एआई को केवल एक प्रकार का उपयोग करना चाहिए)" : "False (An AI must only use exactly one type)" }
      ],
      correct: "A"
    }
  ];

  const handleSlideOption = (slideIndex: number, optionKey: string, correctKey: string) => {
    if (slideAnswers[slideIndex]) return; // Answer locked
    
    setSlideAnswers({ ...slideAnswers, [slideIndex]: optionKey });
    const isCorrect = optionKey === correctKey;
    const currentSlideObj = slides[slideIndex];
    const feedback = isCorrect ? currentSlideObj.correctFeedback : currentSlideObj.incorrectFeedback;
    setSlideFeedback({ ...slideFeedback, [slideIndex]: feedback || "" });

    // If we have answered all three questions on slides 1, 2, 3
    const answeredCount = Object.keys({ ...slideAnswers, [slideIndex]: optionKey }).length;
    if (answeredCount >= 3) {
      onCompleteLab(); // Marks Lab Completed (XP registers)
    }
  };

  const handleQuizOption = (qId: number, optionKey: string) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optionKey });
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      alert(t.pleaseAnswerAll);
      return;
    }

    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(finalPercent);
    setQuizSubmitted(true);
    onCompleteKnowledgeCheck(finalPercent);
  };

  return (
    <div className="space-y-10" id="learning-lab-container">
      {/* Immersive Virtual Door Selector */}
      {!activeDoor ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">{t.doorHeader}</h1>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              {t.doorDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="laboratory-doors">
            {/* Supervised Door */}
            <div 
              onClick={() => { setActiveDoor("supervised"); setCurrentSlide(1); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all text-left space-y-4"
              id="supervised-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Mail size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">SECTOR A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display">{t.supervisedTitle}</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">{t.supervisedSubtitle}</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {t.supervisedDesc}
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyan-400 flex items-center gap-1 font-mono">
                {t.enterChamber} <ArrowRight size={14} />
              </div>
            </div>

            {/* Unsupervised Door */}
            <div 
              onClick={() => { setActiveDoor("unsupervised"); setCurrentSlide(2); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-left space-y-4"
              id="unsupervised-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Users size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">SECTOR B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors font-display">{t.unsupervisedTitle}</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">{t.unsupervisedSubtitle}</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {t.unsupervisedDesc}
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                {t.enterChamber} <ArrowRight size={14} />
              </div>
            </div>

            {/* Reinforcement Door */}
            <div 
              onClick={() => { setActiveDoor("reinforcement"); setCurrentSlide(3); }}
              className="group cursor-pointer p-6 rounded-[2rem] glass hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/5 transition-all text-left space-y-4"
              id="reinforcement-door"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
                  <Flame size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">SECTOR C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors font-display">{t.reinforcementTitle}</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">{t.reinforcementSubtitle}</p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {t.reinforcementDesc}
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">
                {t.enterChamber} <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Virtual Presentation slides inside the selected chamber */
        <div className="space-y-6" id="presentation-deck">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveDoor(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              id="back-to-doors-btn"
            >
              <ArrowLeft size={14} /> {t.backToDoors}
            </button>
            <div className="text-xs font-mono text-slate-400">
              {t.slideIndicator} {currentSlide + 1} {t.of} {slides.length}
            </div>
          </div>

          {/* Core Interactive Card */}
          <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6 relative" id="active-slide-card">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight font-display">{slides[currentSlide].title}</h2>
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">{slides[currentSlide].subtitle}</p>
            </div>

            {/* Slide Body */}
            {slides[currentSlide].interactiveType === "compare" ? (
              /* COMPARISON MATRIX SLIDE */
              <div className="space-y-6 animate-fade-in" id="comparison-matrix-view">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isHi ? "बहुत बढ़िया। आपने तीनों संज्ञानात्मक कक्षों की खोज कर ली है। अपने वैज्ञानिक मापदंडों को लॉक करने के लिए इस तुलना कार्ड का उपयोग करें:" : "Excellent. You have explored all three cognitive chambers. Use this quick comparison card to lock in your scientific parameters:"}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-xs tracking-wider font-mono">
                        <th className="py-3 px-4">{isHi ? "प्रतिमान (Paradigm)" : "Paradigm"}</th>
                        <th className="py-3 px-4">{isHi ? "मुख्य प्रशिक्षण डेटा" : "Core Training Data"}</th>
                        <th className="py-3 px-4">{isHi ? "एल्गोरिथम लक्ष्य" : "Algorithmic Goal"}</th>
                        <th className="py-3 px-4">{isHi ? "वास्तविक दुनिया का मामला" : "Real-World Case"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-4 px-4 font-bold text-cyan-400">Supervised</td>
                        <td className="py-4 px-4">{isHi ? "लेबल वाले उदाहरण (इनपुट + लक्ष्य)" : "Labeled examples (inputs + targets)"}</td>
                        <td className="py-4 px-4">{isHi ? "इनपुट को स्पष्ट या निरंतर लेबल पर मैप करना" : "Map input to discrete or continuous labels"}</td>
                        <td className="py-4 px-4">{isHi ? "स्पैम फ़िल्टर, ट्यूमर वर्गीकरण" : "Spam filter, Tumor classification"}</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-emerald-400">Unsupervised</td>
                        <td className="py-4 px-4">{isHi ? "केवल कच्चे इनपुट (कोई मैन्युअल मानव टैग नहीं)" : "Raw inputs only (no manual human tags)"}</td>
                        <td className="py-4 px-4">{isHi ? "क्लस्टर खोजना और प्रवृत्तियों को जोड़ना" : "Discover clusters and associate trends"}</td>
                        <td className="py-4 px-4">{isHi ? "ग्राहक खरीदारी विभाजन" : "Customer shopping segmentation"}</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 font-bold text-rose-400">Reinforcement</td>
                        <td className="py-4 px-4">{isHi ? "पर्यावरणीय फीड और कस्टम इनाम नीति" : "Environmental feed & custom reward policy"}</td>
                        <td className="py-4 px-4">{isHi ? "संचयी प्रतिक्रिया अंकों को अधिकतम करना" : "Maximize cumulative feedback points"}</td>
                        <td className="py-4 px-4">{isHi ? "स्व-चालित मार्ग, रोबोट चाल नियंत्रण" : "Self-driving routes, Robot gait control"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* REGULAR INTERACTIVE SLIDES */
              <div className="space-y-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {slides[currentSlide].content}
                </p>

                {slides[currentSlide].scenario && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">{t.evidenceTitle}</span>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {slides[currentSlide].scenario}
                    </p>
                  </div>
                )}

                {/* Multiple choice question for the slide */}
                {slides[currentSlide].question && (
                  <div className="space-y-4 pt-2 border-t border-slate-800/40">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <HelpCircle size={16} className="text-indigo-400" />
                      {slides[currentSlide].question}
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {slides[currentSlide].options?.map((opt) => {
                        const isSelected = slideAnswers[currentSlide] === opt.key;
                        const isCorrect = opt.key === slides[currentSlide].correctKey;
                        const hasAnswered = !!slideAnswers[currentSlide];

                        let borderClass = "border-slate-800 hover:border-slate-700 bg-slate-950/40";
                        if (isSelected) {
                          borderClass = isCorrect ? "border-emerald-500 bg-emerald-950/25" : "border-red-500 bg-red-950/25";
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSlideOption(currentSlide, opt.key, slides[currentSlide].correctKey || "")}
                            disabled={hasAnswered}
                            className={`p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${borderClass} ${hasAnswered ? "cursor-default" : "cursor-pointer"}`}
                            id={`slide-${currentSlide}-option-${opt.key}`}
                          >
                            <span className={isSelected ? "font-semibold text-white" : "text-slate-300"}>
                              {opt.text}
                            </span>
                            {isSelected && (
                              isCorrect ? <Check className="text-emerald-400" size={16} /> : <X className="text-red-400" size={16} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanatory feedback if answered */}
                    {slideFeedback[currentSlide] && (
                      <div className={`p-4 rounded-xl text-xs leading-relaxed ${slideAnswers[currentSlide] === slides[currentSlide].correctKey ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-900/30' : 'bg-red-950/20 text-red-300 border border-red-900/30'}`}>
                        {slideFeedback[currentSlide]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Slider / Carousel Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                id="prev-slide-btn"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-6 bg-cyan-400' : 'w-2 bg-white/10'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  if (currentSlide < slides.length - 1) {
                    setCurrentSlide((prev) => prev + 1);
                  } else {
                    // Comparative matrix complete
                    setActiveDoor(null);
                  }
                }}
                className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                id="next-slide-btn"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Knowledge Check Section */}
      <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="knowledge-check-section">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <HelpCircle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">{t.verificationTitle}</h2>
            <p className="text-xs text-slate-400 font-mono">{t.verificationSub}</p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          {t.passingScoreNote}
        </p>

        {/* Diagnostic Quiz Grid */}
        <div className="space-y-6 pt-2">
          {quizQuestions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3" id={`quiz-q-${q.id}`}>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-xs text-cyan-400 mt-1 font-bold">0{idx + 1}.</span>
                <h4 className="text-sm font-semibold text-slate-200 leading-relaxed">{q.q}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {q.options.map((opt) => {
                  const isSelected = quizAnswers[q.id] === opt.key;
                  const isCorrect = opt.key === q.correct;
                  const showResult = quizSubmitted;

                  let optClass = "border-white/10 hover:border-white/20 text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer";
                  if (isSelected) {
                    optClass = "border-cyan-400 bg-cyan-500/10 text-white font-semibold";
                  }
                  if (showResult) {
                    if (isCorrect) {
                      optClass = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold";
                    } else if (isSelected) {
                      optClass = "border-red-500 bg-red-500/20 text-red-300";
                    } else {
                      optClass = "border-transparent bg-white/5 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleQuizOption(q.id, opt.key)}
                      disabled={quizSubmitted}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${optClass}`}
                      id={`quiz-${q.id}-opt-${opt.key}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit or Score Board */}
        {quizSubmitted ? (
          <div className="p-5 rounded-2xl glass-light border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4" id="quiz-result-banner">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">{t.calibrationScore}</div>
              <div className="text-2xl font-black text-white mt-1">
                {quizScore}% ({quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length} / {quizQuestions.length} {isHi ? "सही" : "Correct"})
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {quizScore >= 80 
                  ? t.passedStatus 
                  : t.failedStatus
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              {quizScore < 80 && (
                <button
                  onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-semibold rounded-lg cursor-pointer"
                  id="retry-quiz-btn"
                >
                  {t.recalibrateBtn}
                </button>
              )}
              <button
                onClick={() => onNavigate("investigation")}
                disabled={quizScore < 80}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-white/5 disabled:to-white/5 disabled:text-slate-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                id="proceed-to-consulting-btn"
              >
                {t.launchScenariosBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmitQuiz}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
              id="submit-knowledge-check-btn"
            >
              {t.submitEvaluation}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
