import React, { useState } from "react";
import { 
  Building, 
  CheckCircle, 
  HelpCircle, 
  Activity, 
  Sparkles, 
  Award, 
  ArrowRight, 
  Star, 
  Compass, 
  Loader2 
} from "lucide-react";
import { InvestigationResult } from "../types";

interface MLInvestigationProps {
  investigationResults: Record<string, InvestigationResult>;
  isCompleted: boolean;
  onSaveResult: (orgId: string, result: InvestigationResult) => void;
  onCompleteInvestigation: () => void;
  onNavigate: (tab: string) => void;
  language?: "en" | "hi";
}

interface CaseStudy {
  id: string;
  org: string;
  problem: string;
  choices: string[];
  correctAnswer: string;
  hints: string;
  details: string;
}

export default function MLInvestigation({
  investigationResults,
  isCompleted,
  onSaveResult,
  onCompleteInvestigation,
  onNavigate,
  language = "hi"
}: MLInvestigationProps) {

  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>("");

  const isHi = language === "hi";

  const t = {
    title: isHi ? "एमएल सलाहकार कार्यालय" : "ML Consultant Office",
    desc: isHi ? "आप पांच अग्रणी संगठनों को सलाह दे रहे हैं। उनकी केस फाइलों का निरीक्षण करें, डेटा प्रकारों का मूल्यांकन करें, और सही शिक्षण मॉडल की सिफारिश करें।" : "You are advising five pioneering organizations. Inspect their case files, evaluate the data types, and recommend the correct learning model.",
    diagnosed: isHi ? "निदान किया गया (Diagnosed)" : "Diagnosed",
    accuracy: isHi ? "सटीकता (Accuracy)" : "Accuracy",
    rating: isHi ? "रेटिंग" : "Rating",
    caseFiles: isHi ? "केस फाइलें" : "Case Files",
    case: isHi ? "मामला" : "CASE",
    activeFile: isHi ? "सक्रिय फ़ाइल" : "ACTIVE FILE",
    directive: isHi ? "निर्देश (Directive)" : "Directive",
    structuralObjective: isHi ? "संरचनात्मक उद्देश्य" : "Structural Objective",
    datasetDetails: isHi ? "डेटासेट विवरण" : "Dataset Details",
    scientificClue: isHi ? "वैज्ञानिक सुराग (SCIENTIFIC CLUE):" : "SCIENTIFIC CLUE:",
    recommendMethodology: isHi ? "प्रशिक्षण पद्धति की सिफारिश करें" : "Recommend Training Methodology",
    learning: isHi ? "लर्निंग" : "Learning",
    evaluatingLoader: isHi ? "एआई सलाहकार विश्लेषणात्मक क्रेडेंशियल्स की समीक्षा कर रहा है..." : "AI Mentor reviewing analytical credentials...",
    mentorHeader: isHi ? "एआई अनुसंधान सलाहकार मूल्यांकन" : "AI Research Mentor Evaluation",
    scientistPortal: isHi ? "एआई वैज्ञानिक पोर्टल" : "AI SCIENTIST PORTAL",
    inspectNextBtn: isHi ? "अगले केस स्टडी का निरीक्षण करें" : "Inspect Next Case Study",
    launchDetectiveBtn: isHi ? "डेटासेट डिटेक्टिव लैब लॉन्च करें" : "Launch Dataset Detective Lab",
    approved: isHi ? "स्वीकृत" : "APPROVED",
    deficit: isHi ? "अपूर्ण" : "DEFICIT",
  };

  const cases: CaseStudy[] = [
    {
      id: "hospital",
      org: isHi ? "सिटी जनरल अस्पताल" : "City General Hospital",
      problem: isHi ? "ऐतिहासिक नैदानिक रिकॉर्ड और निदान किए गए रोगी परिणामों से बीमारी की संवेदनशीलता की भविष्यवाणी करें।" : "Predict disease susceptibility from historical clinical records and diagnosed patient outcomes.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Supervised",
      hints: isHi ? "अस्पताल के पास पहले से ही ऐतिहासिक नैदानिक रिकॉर्ड हैं जो निदान परिणामों (उदा. 'बीमार' या 'स्वस्थ') के साथ लेबल किए गए हैं।" : "The hospital already possesses historical clinical records which are labeled with diagnosed outcomes (e.g., 'Sick' or 'Healthy').",
      details: isHi ? "पिछले दर्ज मामलों के आधार पर उच्च जोखिम वाले व्यक्तियों को चिह्नित करने और रोगी के बायोमार्कर (हृदय गति, रक्त पैनल, जीनोमिक वेरिएंट) को पचाने के लिए एक मशीन लर्निंग पाइपलाइन की आवश्यकता होती है।" : "A machine learning pipeline is required to digest patient biomarkers (heart rate, blood panels, genomic variants) and flag high-risk individuals based on previously recorded cases."
    },
    {
      id: "retail",
      org: isHi ? "स्टारलाइट रिटेल ग्रुप" : "Starlight Retail Group",
      problem: isHi ? "खरीदारी की आदतों और आवृत्तियों के आधार पर अज्ञात खुदरा ग्राहकों को समूहों में विभाजित करें।" : "Group anonymous retail customers into segments based on matching buying habits and frequencies.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Unsupervised",
      hints: isHi ? "कोई पूर्व-निर्धारित श्रेणियां या लेबल नहीं हैं। हम केवल उन खरीदारों को समूहित करना चाहते हैं जो समान वस्तुएं खरीदते हैं।" : "There are no pre-existing categories or labels. We simply want to cluster shoppers who buy similar items.",
      details: isHi ? "व्यवसाय अपने ईमेल प्रचारों को अनुकूलित करना चाहता है। वे गुप्त खरीदारी व्यक्तित्वों को प्रकट करने के लिए अपने सघन लेनदेन डेटाबेस को स्वाभाविक रूप से समूहित करना चाहते हैं।" : "The business wishes to optimize their email promotions. They want to naturally cluster their dense transactions database to reveal latent shopping personalities."
    },
    {
      id: "gaming",
      org: isHi ? "एयरो स्टूडियो गेमिंग" : "Aero Studios Gaming",
      problem: isHi ? "गेमप्ले रणनीतियों में महारत हासिल करने और मनुष्यों के समकक्ष खेलने के लिए एक बुद्धिमान गैर-खिलाड़ी चरित्र (NPC) को प्रशिक्षित करें।" : "Train an intelligent non-player character (NPC) to master gameplay strategies and play on par with humans.",
      choices: ["Supervised", "Unsupervised", "Reinforcement"],
      correctAnswer: "Reinforcement",
      hints: isHi ? "प्रणाली को आभासी इंजन पर परीक्षण करके और जीवित रहने के लिए पुरस्कार प्राप्त करके गतिशील रूप से सीखना चाहिए।" : "The system should learn dynamically by testing actions on the virtual engine, receiving rewards for staying alive.",
      details: isHi ? "डेवलपर उड़ान सिम्युलेटर में एक स्वायत्त लड़ाकू जेट को प्रशिक्षित करना चाहता है। एजेंट को अपने दम पर उड़ान निर्देशांक और सामरिक व्यवहार को अनुकूलित होना चाहिए।" : "The developer wants to train an autonomous fighter jet in a flight simulator. The agent must optimize flight coordinates and tactical behaviors on its own."
    },
    {
      id: "bank",
      org: isHi ? "मेरिडियन ट्रस्ट बैंक" : "Meridian Trust Bank",
      problem: isHi ? "लाखों दैनिक ऑनलाइन खरीद रिकॉर्डों में से धोखाधड़ी वाले क्रेडिट कार्ड लेनदेन की पहचान करें।" : "Identify fraudulent credit card transactions among millions of daily online purchase records.",
      choices: ["Supervised", "Unsupervised"],
      correctAnswer: "Supervised",
      hints: isHi ? "डेटासेट में विशेष रूप से 'वैध' या 'धोखाधड़ी' के रूप में चिह्नित इतिहास रिकॉर्ड शामिल हैं।" : "The dataset includes history records marked explicitly as 'Legitimate' or 'Fraudulent'.",
      details: isHi ? "वित्तीय धोखाधड़ी के लिए तेजी से वर्गीकरण की आवश्यकता होती है। बैंक के पास अरबों लेनदेन का ऐतिहासिक रिकॉर्ड है, जिसमें चार्जबैक को पहले से ही धोखाधड़ी के रूप में टैग किया गया है।" : "Financial fraud requires rapid classification. The bank has historical records of billions of swipes, with chargebacks already tagged as fraud."
    },
    {
      id: "warehouse",
      org: isHi ? "नेक्सस स्वायत्त गोदाम" : "Nexus Autonomous Warehouses",
      problem: isHi ? "लॉजिस्टिक्स डिलीवरी ड्रोन को बदलते लेआउट के माध्यम से सबसे छोटा, सबसे सुरक्षित मार्ग सीखने का निर्देश दें।" : "Instruct a logistics delivery drone to learn the shortest, safest route through a changing layout.",
      choices: ["Supervised", "Reinforcement"],
      correctAnswer: "Reinforcement",
      hints: isHi ? "ड्रोन को निर्देशांक पर तेजी से पहुंचने के लिए निरंतर सकारात्मक पुरस्कार और टकराव के लिए दंड प्राप्त होता है।" : "The drone receives continuous positive rewards for arriving at coordinates quickly and penalties for collisions.",
      details: isHi ? "अलमारियों और फोर्कलिफ्टों का लेआउट वास्तविक समय में बदलता रहता है। प्रणाली को निरंतर परीक्षण और त्रुटि सिमुलेशन लूप के माध्यम से गतिशील बाधा परिहार सीखना चाहिए।" : "The layout of shelves and forklifts shifts in real-time. The system must learn dynamic obstacle avoidance through continuous trial-and-error simulation loops."
    }
  ];

  const activeCase = cases[activeCaseIndex];
  const activeResult = investigationResults[activeCase.id];

  const handleSelectChoice = async (choice: string) => {
    if (activeResult) return; // Case already answered
    setSelectedChoice(choice);
    setEvaluating(true);

    const isCorrect = choice === activeCase.correctAnswer;
    let mentorFeedback = "";

    try {
      const response = await fetch("/api/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "investigation",
          language: language,
          data: {
            org: activeCase.org,
            problem: activeCase.problem,
            choice,
            correctAnswer: activeCase.correctAnswer
          }
        }),
      });
      const data = await response.json();
      mentorFeedback = data.feedback;
    } catch (e) {
      console.error(e);
      // Fallback feedback if Gemini server is unresponsive
      mentorFeedback = isCorrect 
        ? (isHi 
            ? `उत्कृष्ट कार्य! ${activeCase.org} समस्या में ज्ञात परिणामों वाले ऐतिहासिक रिकॉर्ड शामिल हैं। यह बिल्कुल सुपरवाइज्ड/रीइन्फोर्समेंट प्रतिमानों के अनुरूप है।`
            : `Excellent job! The ${activeCase.org} problem features historical records with known results. This aligns precisely with Supervised/Reinforcement paradigms.`)
        : (isHi
            ? `अनसुपरवाइज्ड लर्निंग क्लस्टर पैटर्न की खोज करती है लेकिन इनपुट लक्ष्यों को मैप नहीं कर सकती है। इसके लिए वैकल्पिक संरेखण की आवश्यकता है।`
            : `Unsupervised Learning discovers cluster patterns but cannot map input targets. This requires alternative structural alignment. Let's adjust parameters.`);
    }

    const result: InvestigationResult = {
      choice,
      isCorrect,
      feedback: mentorFeedback
    };

    onSaveResult(activeCase.id, result);
    setCurrentFeedback(mentorFeedback);
    setEvaluating(false);

    // If this completes the 5th scenario
    const totalAnswered = Object.keys({ ...investigationResults, [activeCase.id]: result }).length;
    if (totalAnswered >= cases.length) {
      onCompleteInvestigation();
    }
  };

  const handleNextCase = () => {
    setSelectedChoice(null);
    setCurrentFeedback("");
    setActiveCaseIndex((prev) => Math.min(cases.length - 1, prev + 1));
  };

  // Stats calculation
  const totalSolvedCount = Object.keys(investigationResults).length;
  const correctCount = Object.values(investigationResults).filter(r => r.isCorrect).length;
  const accuracy = totalSolvedCount > 0 ? Math.round((correctCount / cases.length) * 100) : 0;

  return (
    <div className="space-y-8" id="ml-investigation-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">{t.title}</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            {t.desc}
          </p>
        </div>
        
        {/* Active consulting dashboard */}
        <div className="glass-light border border-white/10 p-4 rounded-2xl flex items-center gap-6" id="consultant-scorecard">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">{t.diagnosed}</div>
            <div className="text-xl font-extrabold text-white">{totalSolvedCount} / {cases.length}</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">{t.accuracy}</div>
            <div className="text-xl font-extrabold text-cyan-400">{accuracy}%</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">{t.rating}</div>
            <div className="flex gap-0.5 text-amber-500 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={12} 
                  fill={star <= Math.ceil((correctCount / cases.length) * 5) ? "currentColor" : "none"} 
                  className={star <= Math.ceil((correctCount / cases.length) * 5) ? "text-amber-500" : "text-white/10"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization Directory Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t.caseFiles}</h3>
          <div className="space-y-2">
            {cases.map((c, idx) => {
              const res = investigationResults[c.id];
              const isActive = idx === activeCaseIndex;

              let borderClass = "border-white/10 bg-white/5";
              if (isActive) borderClass = "border-cyan-400 bg-cyan-500/10";
              else if (res) borderClass = res.isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5";

              return (
                <button
                  key={c.id}
                  onClick={() => { setActiveCaseIndex(idx); setSelectedChoice(null); }}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all hover:border-white/20 cursor-pointer ${borderClass}`}
                  id={`case-sidebar-item-${c.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 text-slate-300 ${isActive ? 'text-cyan-400' : ''}`}>
                      <Building size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-display">{c.org}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.case} {idx + 1}</p>
                    </div>
                  </div>
                  {res && (
                    res.isCorrect 
                    ? <span className="text-emerald-400 text-xs font-bold font-mono">{t.approved}</span>
                    : <span className="text-red-400 text-xs font-bold font-mono">{t.deficit}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Active Case Analysis */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6 relative" id="active-case-analyzer">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">{t.activeFile} // {activeCase.org}</span>
              <h2 className="text-2xl font-black text-white tracking-tight font-display">{activeCase.org} {t.directive}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t.structuralObjective}</h3>
              <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                {activeCase.problem}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t.datasetDetails}</h3>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                {activeCase.details}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 font-mono">{t.scientificClue}</strong> {activeCase.hints}
            </div>
          </div>

          {/* Model selection interface */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t.recommendMethodology}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCase.choices.map((choice) => {
                const res = investigationResults[activeCase.id];
                const isSelected = res ? res.choice === choice : selectedChoice === choice;
                const isCorrect = choice === activeCase.correctAnswer;
                
                let btnClass = "border-white/10 hover:border-white/20 bg-white/5 text-slate-200 cursor-pointer";
                if (res) {
                  if (res.choice === choice) {
                    btnClass = res.isCorrect 
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold"
                      : "border-red-500 bg-red-500/20 text-red-400 font-bold";
                  } else if (choice === activeCase.correctAnswer) {
                    btnClass = "border-emerald-500/30 bg-white/5 text-emerald-400 font-medium";
                  } else {
                    btnClass = "border-transparent bg-white/5 text-slate-600 opacity-40 cursor-default";
                  }
                } else if (isSelected) {
                  btnClass = "border-cyan-400 bg-cyan-500/10 text-white font-bold";
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={!!res || evaluating}
                    className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${btnClass}`}
                    id={`case-${activeCase.id}-choice-${choice}`}
                  >
                    {isHi ? (choice === "Supervised" ? "सुपरवाइज्ड (Supervised)" : choice === "Unsupervised" ? "अनसुपरवाइज्ड (Unsupervised)" : "रीइन्फोर्समेंट (Reinforcement)") : choice} {t.learning}
                  </button>
                );
              })}
            </div>

            {/* AI evaluating loader */}
            {evaluating && (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-slate-300 text-sm font-medium animate-pulse" id="mentor-evaluating-loader">
                <Loader2 className="animate-spin text-cyan-400" size={18} />
                <span>{t.evaluatingLoader}</span>
              </div>
            )}

            {/* AI Mentor feedback display */}
            {(activeResult || currentFeedback) && !evaluating && (
              <div className={`p-5 rounded-2xl border space-y-3 ${
                (activeResult?.isCorrect || selectedChoice === activeCase.correctAnswer) 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-red-500/10 border-red-500/20'
              }`} id="mentor-feedback-box">
                <div className="flex items-center gap-2">
                  <Sparkles className={(activeResult?.isCorrect || selectedChoice === activeCase.correctAnswer) ? "text-emerald-400" : "text-red-400"} size={16} />
                  <span className="text-xs font-extrabold uppercase font-mono tracking-wider">{t.mentorHeader}</span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed markdown-body">
                  {activeResult ? activeResult.feedback : currentFeedback}
                </div>
              </div>
            )}
          </div>

          {/* Forward controls */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <span className="text-xs text-slate-500 font-mono uppercase">{t.scientistPortal}</span>
            
            {activeResult && activeCaseIndex < cases.length - 1 && (
              <button
                onClick={handleNextCase}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                id="next-case-btn"
              >
                {t.inspectNextBtn}
                <ArrowRight size={14} />
              </button>
            )}

            {isCompleted && activeCaseIndex === cases.length - 1 && (
              <button
                onClick={() => onNavigate("detective")}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer shadow-cyan-500/20"
                id="investigation-finish-btn"
              >
                {t.launchDetectiveBtn}
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
