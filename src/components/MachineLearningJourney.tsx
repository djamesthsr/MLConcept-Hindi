import React, { useState } from "react";
import { 
  TrendingUp, 
  Map, 
  Check, 
  X, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Compass, 
  MessageSquare,
  Award 
} from "lucide-react";

interface MachineLearningJourneyProps {
  timelineViewed: boolean;
  reflectionCompleted: boolean;
  onViewTimeline: () => void;
  onCompleteReflection: (essays: { interest: string; dailyLife: string; goodData: string }) => void;
  onNavigate: (tab: string) => void;
  language?: "en" | "hi";
}

interface TimelineItem {
  stage: string;
  desc: string;
  scientificContext: string;
  keyMetric: string;
}

interface Scenario {
  id: string;
  system: string;
  category: "Supervised" | "Unsupervised" | "RL";
  reason: string;
}

export default function MachineLearningJourney({
  timelineViewed,
  reflectionCompleted,
  onViewTimeline,
  onCompleteReflection,
  onNavigate,
  language = "hi"
}: MachineLearningJourneyProps) {

  const isHi = language === "hi";

  const t = {
    // Alert / error
    alertMinChars: isHi ? "सलाहकार को भेजने से पहले कृपया एक विस्तृत उत्तर (कम से कम 15 वर्ण) लिखें।" : "Please write a detailed answer (at least 15 characters) before submitting to the mentor.",
    errorClassifyMatrix: isHi ? "कृपया पहले मैट्रिक्स में सभी रोजमर्रा के परिदृश्यों को वर्गीकृत करें।" : "Please classify all everyday scenarios in the Matrix first.",
    errorShortReflections: isHi ? "कृपया अपना वैज्ञानिक पोर्टफोलियो सहेजने से पहले तीनों प्रतिबिंब प्रश्नों के लिए विस्तृत उत्तर (न्यूनतम 15 वर्ण प्रत्येक) लिखें।" : "Please write a detailed response for all three reflection questions (minimum 15 characters each) before saving your scientific portfolio.",
    
    // Activity A
    activityAHeader: isHi ? "गतिविधि 4A: वैज्ञानिक यात्रा समयरेखा" : "Activity 4A: Scientific Journey Timeline",
    activityASub: isHi ? "प्रत्येक प्रणाली विकास चरण का अन्वेषण करें" : "EXPLORE EACH SYSTEM DEVELOPMENT PHASE",
    activityADesc: isHi ? "मॉडल डेटा एकत्र करने से लेकर वास्तविक दुनिया के एकीकरण तक कैसे विकसित होते हैं? इंजीनियरिंग प्रक्रियाओं का निरीक्षण करने के लिए नीचे दी गई समयरेखा के प्रत्येक चरण पर क्लिक करें:" : "How do models evolve from data gathering to real-world integration? Click on each phase of the timeline below to inspect the engineering procedures:",
    phaseLabel: isHi ? "चरण" : "Phase",
    keyParameter: isHi ? "मुख्य पैरामीटर:" : "KEY PARAMETER:",

    // Activity B
    activityBHeader: isHi ? "गतिविधि 4B: दैनिक परिदृश्य वर्गीकरण मैट्रिक्स" : "Activity 4B: Everyday Scenario Classification Matrix",
    activityBSub: isHi ? "व्यावहारिक प्रणालियों को पद्धतियों में मैप करें" : "MAP PRACTICAL SYSTEMS TO METHODOLOGIES",
    activityBDesc: isHi ? "प्रत्येक आधुनिक अनुप्रयोग के भीतर एम्बेडेड शिक्षण पद्धति की पहचान करें। सही वर्गीकरण तत्काल नैदानिक ​​तर्क प्रकट करता है।" : "Identify the learning methodology embedded inside each modern application. Correct classifications reveal instant diagnostic rationale.",
    tableCase: isHi ? "एआई सिस्टम केस" : "AI System Case",
    tableSupervised: isHi ? "सुपरवाइज्ड" : "Supervised",
    tableUnsupervised: isHi ? "अनसुपरवाइज्ड" : "Unsupervised",
    tableReinforcement: isHi ? "रीइन्फोर्समेंट" : "Reinforcement",
    correct: isHi ? "सही!" : "Correct!",
    incorrect: isHi ? "गलत!" : "Incorrect!",
    rationale: isHi ? "तर्क:" : "Rationale:",

    // Activity C
    activityCHeader: isHi ? "गतिविधि 4C: वैज्ञानिक पोर्टफोलियो प्रतिबिंब" : "Activity 4C: Scientific Portfolio Reflections",
    activityCSub: isHi ? "विशेषज्ञ संरक्षक को संवाद प्रस्तुत करें" : "SUBMIT DIALOGUES TO THE EXPERT MENTOR",
    activityCDesc: isHi ? "अपने अंतिम चिंतनशील विचार साझा करें। गतिशील, एआई-जनित वैज्ञानिक मूल्यांकन प्राप्त करने के लिए प्रत्येक निबंध प्रॉम्प्ट के बगल में विशेषज्ञ संरक्षक से परामर्श करें (Consult Mentor) पर क्लिक करें!" : "Commit your final reflective insights. Click Consult Mentor next to each essay prompt to receive dynamic, AI-generated scientific evaluations!",
    consultMentorBtn: isHi ? "विशेषज्ञ से परामर्श करें" : "Consult Mentor",
    analyzing: isHi ? "विश्लेषण हो रहा है..." : "Analyzing...",
    mentorCritique: isHi ? "एआई संरक्षक समीक्षा:" : "AI Mentor Critique",
    systemCalibration: isHi ? "पोर्टफोलियो अंशांकन प्रणाली" : "PORTFOLIO CALIBRATION SYSTEM",
    sealSubmitBtn: isHi ? "सील करें और पोर्टफोलियो जमा करें" : "Seal and Submit Portfolio",
    portfolioSealed: isHi ? "पोर्टफोलियो सील कर दिया गया। मिशन अनलॉक के लिए तैयार है!" : "Portfolio Sealed. Mission ready for unlock!",
    unlockBadgeBtn: isHi ? "वैज्ञानिक बैज और रिपोर्ट अनलॉक करें" : "Unlock Scientist Badge & Report",
    
    // Fallback critique
    fallbackCritique: isHi ? "उत्कृष्ट वैज्ञानिक अंतर्दृष्टि! आपकी प्रतिक्रिया मशीन लर्निंग गतिशीलता की एक मजबूत वैचारिक समझ को प्रकट करती है।" : "Excellent scientific insight! Your response reveals a strong conceptual grasp of machine learning dynamics."
  };

  // Timeline Data
  const timelineStages: TimelineItem[] = [
    {
      stage: isHi ? "डेटा एकत्र करें" : "Collect Data",
      desc: isHi ? "एआई डिजिटल वातावरण से जानकारी एकत्र करता है।" : "AI gathers information from digital environments.",
      scientificContext: isHi ? "डेटा वैज्ञानिक अनुभवजन्य आधार स्थापित करने के लिए कच्चे इनपुट, सेंसर रिकॉर्डिंग, वेब डेटाबेस या छवि दीर्घाओं को एकत्र करते हैं।" : "Data scientists aggregate raw inputs, sensor recordings, web databases, or image galleries to establish the empirical foundation.",
      keyMetric: isHi ? "कच्चा डेटाबेस आकार और कार्डिनैलिटी" : "Raw database size & cardinality"
    },
    {
      stage: isHi ? "डेटा तैयार करें" : "Prepare Data",
      desc: isHi ? "संरचनात्मक त्रुटियों को हटाएँ और जानकारी व्यवस्थित करें।" : "Remove structural errors and organize information.",
      scientificContext: isHi ? "शोर-शराबे वाला डेटा पक्षपाती मॉडल की ओर ले जाता है। इंजीनियर मानों को साफ़ करते हैं, लापता सूचकांकों को बदलते हैं, चर को सामान्य करते हैं, और नमूनों को प्रशिक्षण/सत्यापन/परीक्षण सेटों में अलग करते हैं।" : "Noisy data leads to biased models. Engineers sanitize values, replace missing indices, normalize variables, and separate samples into training/validation/test sets.",
      keyMetric: isHi ? "सिग्नल-टू-नॉइज अनुपात और फीचर भार" : "Signal-to-noise ratio & feature weights"
    },
    {
      stage: isHi ? "मॉडल प्रशिक्षित करें" : "Train Model",
      desc: isHi ? "MODEL गणितीय पैटर्न सीखने के लिए एल्गोरिदम चलाता है।" : "The model runs algorithms to learn mathematical patterns.",
      scientificContext: isHi ? "एल्गोरिथ्म चयनित एमएल प्रतिमान के आधार पर सहसंबंधों, सीमाओं या पुरस्कारों को ढूंढते हुए अपने आंतरिक बीजगणितीय भार को समायोजित करता है।" : "The algorithm adjusts its internal algebraic weights, finding correlations, borders, or rewards based on the ML paradigm selected.",
      keyMetric: isHi ? "हानि कार्य अभिसरण दर" : "Loss function convergence rate"
    },
    {
      stage: isHi ? "मॉडल का परीक्षण करें" : "Test Model",
      desc: isHi ? "पवित्र परीक्षण सेटों का उपयोग करके भविष्यवाणियों का मूल्यांकन करें।" : "Evaluate predictions using pristine test sets.",
      scientificContext: isHi ? "मॉडल सत्यापन सेटों पर भविष्यवाणियों का प्रयास करता है जो उसने पहले कभी नहीं देखे हैं, जिससे शोधकर्ताओं को वास्तविक दुनिया के सामान्यीकरण का मूल्यांकन करने की अनुमति मिलती है।" : "The model attempts predictions on validation sets it has never seen before, allowing researchers to evaluate real-world generalization.",
      keyMetric: isHi ? "कन्फ्यूजन मैट्रिक्स और सटीकता प्रतिशत" : "Confusion matrix & accuracy percentage"
    },
    {
      stage: isHi ? "मॉडल में सुधार करें" : "Improve Model",
      desc: isHi ? "नए इनपुट या पैरामीटर बदलावों का उपयोग करके एल्गोरिदम को परिष्कृत करें।" : "Refine algorithms using new inputs or parameter shifts.",
      scientificContext: isHi ? "यदि सत्यापन में त्रुटियां आती हैं, तो डेवलपर्स हाइपरपैरामीटर (लर्निंग रेट, परतें, डिस्काउंट कारक) को समायोजित करते हैं और नए प्रशिक्षण एपिसोड चलाते हैं।" : "If validation yields errors, developers adjust hyperparameters (learning rate, layers, discount factors) and run new training episodes.",
      keyMetric: isHi ? "F1 स्कोर और सामान्य सामान्यीकरण दर" : "F1 Score & general generalization rate"
    },
    {
      stage: isHi ? "मॉडल को तैनात करें" : "Deploy Model",
      desc: isHi ? "सत्यापित मॉडल को वास्तविक दुनिया में जारी करें।" : "Release the validated model to the real world.",
      scientificContext: isHi ? "मॉडल को सक्रिय माइक्रोसर्विस के रूप में क्लाउड कंटेनर पर लोड किया जाता है, जिससे लाइव एप्लिकेशन मिलीसेकंड में अनुमान लगा सकते हैं।" : "The model is loaded onto Cloud containers as an active microservice, allowing live applications to make inferences in milliseconds.",
      keyMetric: isHi ? "एपीआई प्रतिक्रिया विलंबता और क्वेरी थ्रूपुट" : "API response latency & query throughput"
    }
  ];

  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [visitedTimelineSteps, setVisitedTimelineSteps] = useState<Record<number, boolean>>({ 0: true });

  const handleTimelineClick = (index: number) => {
    setActiveTimelineIndex(index);
    const nextVisited = { ...visitedTimelineSteps, [index]: true };
    setVisitedTimelineSteps(nextVisited);

    // If they have visited all 6 timeline steps
    const visitedCount = Object.keys(nextVisited).length;
    if (visitedCount === timelineStages.length && !timelineViewed) {
      onViewTimeline();
    }
  };

  // Scenario Classification Matrix Data
  const scenarios: Scenario[] = [
    {
      id: "netflix",
      system: isHi ? "नेटफ्लिक्स सिफारिशें" : "Netflix Recommendations",
      category: "Unsupervised",
      reason: isHi ? "नेटफ्लिक्स बिना किसी पूर्व-लिखित शैली सीमाओं के समान देखने के इतिहास (सहयोगात्मक फ़िल्टरिंग क्लस्टर) के आधार पर मिलान करने वाले उपयोगकर्ताओं को समूहित करता है।" : "Netflix groups matching users based on similar viewing histories (collaborative filtering clusters) with no pre-written genre boundaries."
    },
    {
      id: "chess",
      system: isHi ? "शतरंज खेलने वाला एआई" : "Chess Playing AI",
      category: "RL",
      reason: isHi ? "एआई एक सक्रिय एजेंट के रूप में कार्य करता है, चालों की खोज करता है, शह और मात के लिए दंडित होता है, और विरोधी के प्रमुख मोहरों को लेने के लिए अंक अर्जित करता है।" : "The AI acts as an active agent, exploring tree moves, getting penalized for checkmate, and earning points for taking major opponent pieces."
    },
    {
      id: "face",
      system: isHi ? "फेस रिकग्निशन लॉक्स" : "Face Recognition Locks",
      category: "Supervised",
      reason: isHi ? "एक कैमरा बायोमेट्रिक लैंडमार्क को स्कैन करता है और उन्हें एक विशिष्ट लॉक किए गए प्रोफाइल पर मैप करता है। यह सत्यापित करने के लिए लेबल की गई प्रशिक्षण तस्वीरों का लाभ उठाता है।" : "A camera scans biometric landmarks and maps them to a specific locked profile. It leverages labeled training photos to verify."
    },
    {
      id: "spotify",
      system: isHi ? "स्पॉटीफाई श्रोता समूह" : "Spotify Listener Groups",
      category: "Unsupervised",
      reason: isHi ? "स्पॉटीफाई उच्च-आयामी श्रवण प्रोफाइल का विश्लेषण करके, कच्चे प्लेलिस्ट ओवरलैप के आधार पर श्रोताओं को मिलान वाले समूह सहकर्मियों में समूहित करता है।" : "Spotify groups listeners into matching taste cohorts based on raw playlist overlap, analyzing high-dimensional listening profiles."
    },
    {
      id: "vacuum",
      system: isHi ? "रोबोट वैक्यूम क्लीनर" : "Robot Vacuum Cleaner",
      category: "RL",
      reason: isHi ? "वैक्यूम समन्वित मार्गों का मानचित्रण करता है, धूल के कणों की सफाई के लिए सकारात्मक स्कोर और बम्पर धक्कों के लिए नकारात्मक स्कोर प्राप्त करता है।" : "The vacuum maps coordinate routes, receiving a positive score for cleaning dust particles and negative scores for bumper bumps."
    },
    {
      id: "disease",
      system: isHi ? "रोग निदान" : "Disease Diagnosis",
      category: "Supervised",
      reason: isHi ? "डायग्नोस्टिक स्कैनर ऊतक स्कैन को वर्गीकृत करने के लिए 'दुर्भावनापूर्ण' या 'सौम्य' के रूप में स्पष्ट रूप से टैग किए गए पिछले नैदानिक ​​​​परीक्षणों पर निर्भर करता है।" : "The diagnostic scanner relies on previous clinical trials tagged explicitly as 'Malicious' or 'Benign' to categorize tissue scans."
    }
  ];

  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, "Supervised" | "Unsupervised" | "RL">>({});

  // Essay prompts
  const [essays, setEssays] = useState({
    interest: "",
    dailyLife: "",
    goodData: ""
  });
  const [mentorFeedbacks, setMentorFeedbacks] = useState<Record<string, string>>({});
  const [submittingEssays, setSubmittingEssays] = useState<Record<string, boolean>>({});
  const [essayErrors, setEssayErrors] = useState("");

  const handleScenarioCheck = (scenarioId: string, selection: "Supervised" | "Unsupervised" | "RL") => {
    setScenarioAnswers({ ...scenarioAnswers, [scenarioId]: selection });
  };

  const handleVerifyEssay = async (field: keyof typeof essays, question: string) => {
    const text = essays[field];
    if (!text.trim() || text.trim().length < 15) {
      alert(t.alertMinChars);
      return;
    }

    setSubmittingEssays(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "reflection",
          language: language,
          data: {
            question,
            response: text
          }
        }),
      });
      const data = await response.json();
      setMentorFeedbacks(prev => ({ ...prev, [field]: data.feedback }));
    } catch (e) {
      console.error(e);
      setMentorFeedbacks(prev => ({
        ...prev,
        [field]: t.fallbackCritique
      }));
    } finally {
      setSubmittingEssays(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmitAllReflections = () => {
    // Check if scenario matrix is complete
    const matrixComplete = Object.keys(scenarioAnswers).length === scenarios.length;
    if (!matrixComplete) {
      setEssayErrors(t.errorClassifyMatrix);
      return;
    }

    // Check if essays are completed
    if (
      !essays.interest.trim() || essays.interest.trim().length < 15 ||
      !essays.dailyLife.trim() || essays.dailyLife.trim().length < 15 ||
      !essays.goodData.trim() || essays.goodData.trim().length < 15
    ) {
      setEssayErrors(t.errorShortReflections);
      return;
    }

    setEssayErrors("");
    onCompleteReflection(essays);
  };

  return (
    <div className="space-y-10" id="ml-journey-container">
      {/* Timeline Section */}
      <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="journey-timeline-panel">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
            <Map size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">{t.activityAHeader}</h2>
            <p className="text-xs text-slate-400 font-mono">{t.activityASub}</p>
          </div>
        </div>

        <p className="text-sm text-slate-300">
          {t.activityADesc}
        </p>

        {/* Timeline Carousel Node Map */}
        <div className="relative pt-4" id="timeline-carousel">
          {/* Horizontal line */}
          <div className="absolute top-[41px] left-8 right-8 h-1 bg-white/10 rounded hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
            {timelineStages.map((item, idx) => {
              const isActive = idx === activeTimelineIndex;
              const wasVisited = !!visitedTimelineSteps[idx];

              return (
                <button
                  key={idx}
                  onClick={() => handleTimelineClick(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-400' 
                      : wasVisited 
                        ? 'border-white/10 bg-white/5 hover:border-white/20' 
                        : 'border-transparent bg-white/5 hover:border-white/10'
                  }`}
                  id={`timeline-node-${idx}`}
                >
                  <div className={`h-12 w-12 rounded-full border flex items-center justify-center font-bold text-sm font-mono mb-2 transition-all ${
                    isActive 
                      ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                      : wasVisited 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                  }`}>
                    0{idx + 1}
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-cyan-400' : wasVisited ? 'text-slate-200' : 'text-slate-500'}`}>
                    {item.stage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Card */}
        <div className="p-5 rounded-2xl glass-light border border-white/10 space-y-3 animate-fade-in" id="timeline-detail-box">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-base font-display">
              {t.phaseLabel} 0{activeTimelineIndex + 1}: {timelineStages[activeTimelineIndex].stage}
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{t.keyParameter} {timelineStages[activeTimelineIndex].keyMetric}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {timelineStages[activeTimelineIndex].desc}
          </p>
          <p className="text-xs text-slate-400 italic bg-white/5 p-3 rounded-lg border border-white/5">
            {timelineStages[activeTimelineIndex].scientificContext}
          </p>
        </div>
      </div>

      {/* Scenario Classification Matrix */}
      {timelineViewed && (
        <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="matrix-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">{t.activityBHeader}</h2>
              <p className="text-xs text-slate-400 font-mono">{t.activityBSub}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            {t.activityBDesc}
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm border-collapse" id="scenario-matrix-table">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase text-xs tracking-wider font-mono">
                  <th className="py-3 px-4">{t.tableCase}</th>
                  <th className="py-3 px-4 text-center">{t.tableSupervised}</th>
                  <th className="py-3 px-4 text-center">{t.tableUnsupervised}</th>
                  <th className="py-3 px-4 text-center">{t.tableReinforcement}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {scenarios.map((sc) => {
                  const selection = scenarioAnswers[sc.id];
                  const hasSelected = !!selection;

                  return (
                    <tr key={sc.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-100 flex flex-col justify-center">
                        <span className="font-display">{sc.system}</span>
                        {hasSelected && (
                          <span className={`text-[10px] font-normal leading-normal mt-1.5 p-2 rounded-xl max-w-lg ${
                            selection === sc.category 
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          }`}>
                            <strong>{selection === sc.category ? t.correct : t.incorrect} {t.rationale}</strong> {sc.reason}
                          </span>
                        )}
                      </td>

                      {(["Supervised", "Unsupervised", "RL"] as const).map((cat) => {
                        const checked = selection === cat;
                        const isCorrect = cat === sc.category;

                        let checkClass = "border-white/10 bg-white/5 hover:border-white/20 cursor-pointer text-slate-300";
                        if (checked) {
                          checkClass = isCorrect 
                            ? "border-emerald-500 text-emerald-300 bg-emerald-500/25" 
                            : "border-rose-500 text-rose-300 bg-rose-500/25";
                        }

                        return (
                          <td key={cat} className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleScenarioCheck(sc.id, cat)}
                              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${checkClass}`}
                              id={`matrix-${sc.id}-toggle-${cat.toLowerCase()}`}
                            >
                              {cat === "Supervised" ? t.tableSupervised : cat === "Unsupervised" ? t.tableUnsupervised : t.tableReinforcement}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reflection Essays */}
      {Object.keys(scenarioAnswers).length === scenarios.length && (
        <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6" id="essays-panel">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-display">{t.activityCHeader}</h2>
              <p className="text-xs text-slate-400 font-mono">{t.activityCSub}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            {t.activityCDesc}
          </p>

          <div className="space-y-6 pt-2">
            {[
              {
                field: "interest" as const,
                q: isHi 
                  ? "कौन सा मशीन लर्निंग प्रकार (सुपरवाइज्ड, अनसुपरवाइज्ड या रीइन्फोर्समेंट) आपको सबसे ज्यादा आकर्षित करता है, और क्यों?" 
                  : "Which Machine Learning type (Supervised, Unsupervised, or Reinforcement) interests you most, and why?",
                placeholder: isHi 
                  ? "मुझे रीइन्फोर्समेंट लर्निंग आकर्षक लगती है क्योंकि एजेंट निरंतर पुरस्कारों के माध्यम से गतिशील रूप से जटिल व्यवहार सीखते हैं..." 
                  : "I find Reinforcement Learning fascinating because of how agents learn complex behaviors dynamically through continuous rewards..."
              },
              {
                field: "dailyLife" as const,
                q: isHi 
                  ? "आपने अपने दैनिक जीवन में मशीन लर्निंग की अवधारणाओं को कहाँ कार्य करते देखा है?" 
                  : "Where have you observed Machine Learning concepts in action in your daily life?",
                placeholder: isHi 
                  ? "मैं अपने ईमेल स्पैम फ़िल्टर और अपने फ़ोन के फेशियल रिकग्निशन लॉक में दैनिक रूप से सुपरवाइज्ड लर्निंग देखता हूँ, जो जैविक टैग से मेल खाता है..." 
                  : "I observe Supervised Learning daily in my email spam filter and my phone's facial recognition lock, which matches biological tags..."
              },
              {
                field: "goodData" as const,
                q: isHi 
                  ? "मशीन अनुभूति स्थापित करने के लिए उच्च-गुणवत्ता, गैर-पक्षपाती प्रशिक्षण डेटा क्यों महत्वपूर्ण है?" 
                  : "Why is high-quality, non-biased training data critical to establishing machine cognition?",
                placeholder: isHi 
                  ? "उच्च-गुणवत्ता वाला डेटा महत्वपूर्ण है क्योंकि पक्षपाती इनपुट सीखे गए सूत्रों को विकृत कर देंगे, जिसके परिणामस्वरूप गलत या भेदभावपूर्ण अनुमान होंगे..." 
                  : "High-quality data is critical because biased inputs will skew the learned formulas, resulting in inaccurate or discriminatory inferences..."
              }
            ].map((item) => {
              const isSubmitting = !!submittingEssays[item.field];
              const feedback = mentorFeedbacks[item.field];

              return (
                <div key={item.field} className="p-5 rounded-2xl glass-light border border-white/10 space-y-3" id={`essay-box-${item.field}`}>
                  <h4 className="text-sm font-bold text-white leading-normal font-display">{item.q}</h4>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <textarea
                      rows={3}
                      value={essays[item.field]}
                      onChange={(e) => setEssays({ ...essays, [item.field]: e.target.value })}
                      disabled={reflectionCompleted}
                      placeholder={item.placeholder}
                      className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed"
                      id={`textarea-${item.field}`}
                    />

                    {!reflectionCompleted && (
                      <button
                        onClick={() => handleVerifyEssay(item.field, item.q)}
                        disabled={isSubmitting || essays[item.field].trim().length < 15}
                        className="w-full md:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-slate-600 border border-white/10 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-all shadow-md cursor-pointer"
                        id={`mentor-consult-btn-${item.field}`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin text-cyan-400" size={14} />
                            {t.analyzing}
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} className="text-cyan-400" />
                            {t.consultMentorBtn}
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Mentor assessment response */}
                  {feedback && (
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300 leading-relaxed flex items-start gap-2 animate-fade-in" id={`feedback-display-${item.field}`}>
                      <Sparkles className="text-cyan-400 shrink-0 mt-0.5 animate-pulse" size={14} />
                      <p>
                        <strong>{t.mentorCritique}</strong> {feedback}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error & Submit Portfolio controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {essayErrors && (
              <p className="text-xs text-rose-400 font-mono" id="essay-validation-error">{essayErrors}</p>
            )}
            <span className="text-xs text-slate-500 font-mono hidden sm:block">{t.systemCalibration}</span>

            {!reflectionCompleted ? (
              <button
                onClick={handleSubmitAllReflections}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-cyan-500/20"
                id="submit-all-reflections-btn"
              >
                {t.sealSubmitBtn}
                <Check size={14} />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-end">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-xl flex items-center gap-1.5">
                  <Award size={14} /> {t.portfolioSealed}
                </div>
                <button
                  onClick={() => onNavigate("report")}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer shadow-cyan-500/20"
                  id="go-to-report-btn"
                >
                  {t.unlockBadgeBtn}
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
