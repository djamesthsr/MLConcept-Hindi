import React, { useEffect, useState } from "react";
import { 
  Award, 
  CheckCircle, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  RefreshCw, 
  ArrowRight, 
  Bookmark, 
  HelpCircle, 
  ChevronRight, 
  Flame
} from "lucide-react";
import { MissionState } from "../types";

interface MissionReportProps {
  state: MissionState;
  onNavigate: (tab: string) => void;
  onUnlockBadge: () => void;
  language?: "en" | "hi";
}

export default function MissionReport({ state, onNavigate, onUnlockBadge, language = "hi" }: MissionReportProps) {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(true);
  const [celebrate, setCelebrate] = useState(false);

  const isHi = language === "hi";

  const t = {
    credentialLevel: isHi ? "क्रेडेंशियल स्तर: स्वीकृत" : "CREDENTIAL LEVEL: GRANTED",
    badgeTitle: isHi ? "मशीन लर्निंग वैज्ञानिक" : "Machine Learning Scientist",
    badgeDesc: isHi ? "आपके नैदानिक मूल्यांकन, डेटासेट अंशांकन और निबंध पोर्टफोलियो को एआई निदेशालय द्वारा सत्यापित किया गया है। आप आधिकारिक रूप से प्रमाणित हैं।" : "Your diagnostic evaluations, dataset calibrations, and essay portfolios have been verified by the AI Directorate. You are officially certified.",
    
    scoreboardTitle: isHi ? "वैज्ञानिक XP स्कोरबोर्ड" : "Scientific XP Scoreboard",
    totalScore: isHi ? "कुल स्कोर" : "Total Score",
    maxAward: isHi ? "अधिकतम अनुभाग पुरस्कार: 120 XP" : "MAXIMUM SECTOR AWARD: 120 XP",
    baseCompletion: isHi ? "मिशन आधार पूर्णता" : "Mission Base Completion",
    knowledgePerfect: isHi ? "ज्ञान परीक्षण सही स्कोर" : "Knowledge Check Perfect Score",
    consultantPerfect: isHi ? "उत्कृष्ट सलाहकार निदान" : "Perfect Consultant Diagnostics",
    ok: isHi ? "ठीक" : "OK",
    miss: isHi ? "छूटा" : "MISS",

    roadmapTitle: isHi ? "मॉड्यूल 5 रोडमैप" : "Module 5 Roadmap",
    roadmapDesc: isHi ? "एमएल अवधारणाओं की आपकी समझ आपको **मॉड्यूल 5: एआई प्रोजेक्ट चक्र** के लिए तैयार करती है। अगले मॉड्यूल में, आप निम्न का अन्वेषण करके संपूर्ण एंड-टू-एंड समाधान डिज़ाइन करेंगे:" : "Your comprehension of ML concepts prepares you for **Module 5: The AI Project Cycle**. In the next module, you will design complete end-to-end solutions by exploring:",
    roadmapUnlocked: isHi ? "मॉड्यूल 5 स्वचालित रूप से अनलॉक हुआ" : "MODULE 5 UNLOCKED AUTOMATICALLY",

    roadmapSteps: isHi ? [
      "समस्या का दायरा (मशीन सीमाओं को परिभाषित करना)",
      "डेटा अधिग्रहण (सुरक्षित डेटा पाइपलाइन)",
      "मॉडल प्रशिक्षण और पैरामीटर विकल्प",
      "परिणाम मूल्यांकन और ग्राहक रिपोर्टिंग"
    ] : [
      "Problem Scoping (defining machine boundaries)",
      "Data Acquisition (securing data pipelines)",
      "Model Training & Parameter Choice",
      "Outcome Evaluation & Client Reporting"
    ],

    labDossier: isHi ? "प्रयोगशाला मूल्यांकन डोजियर" : "Lab Evaluation Dossier",
    synthesizing: isHi ? "व्यक्तिगत छात्र मूल्यांकन का संश्लेषण किया जा रहा है..." : "Synthesizing personalized student assessment...",
    digesting: isHi ? "संज्ञानात्मक मैट्रिक्स चर और प्रतिबिंबों का विश्लेषण..." : "Digesting cognitive matrix variables & reflections",
    diagnosticsDeck: isHi ? "एआई इनोवेशन रिसर्च लैब // डायग्नोस्टिक्स डेक" : "AI INNOVATION RESEARCH LAB // DIAGNOSTICS DECK"
  };

  // XP breakdown
  const completionXP = 80;
  const isPerfectKnowledge = state.progress.knowledgeCheckScore === 100;
  const perfectKnowledgeXP = isPerfectKnowledge ? 20 : 0;
  
  const correctInvsCount = Object.keys(state.investigationResults).filter(key => state.investigationResults[key]?.isCorrect).length;
  const isPerfectInvs = correctInvsCount === 5;
  const perfectInvsXP = isPerfectInvs ? 20 : 0;

  const totalXPObtained = completionXP + perfectKnowledgeXP + perfectInvsXP;

  const fetchReport = async () => {
    setLoading(true);
    setReportText("");
    try {
      const response = await fetch("/api/mission-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: state.userName,
          score: state.progress.knowledgeCheckScore,
          answers: state.answers,
          reflection: state.reflections,
          language: language
        }),
      });
      const data = await response.json();
      setReportText(data.report);
      
      // Auto-unlock badge state in parent
      onUnlockBadge();
      
      // Trigger celebrate visual pop
      setCelebrate(true);
    } catch (e) {
      console.error(e);
      setReportText(
        isHi
          ? `### प्रयोगशाला मूल्यांकन रिपोर्ट
**वैज्ञानिक:** ${state.userName}  
**बैज स्थिति:** प्रमाणित मशीन लर्निंग वैज्ञानिक (🧠)  

सभी नैदानिक ​​मॉड्यूल में आपका प्रदर्शन अत्यंत सराहनीय है। आपने हमारे आभासी कक्षों के भीतर स्पष्ट विश्लेषणात्मक क्षमता का प्रदर्शन किया, जटिल डेटासेट को वर्गीकृत किया और उपयुक्त शिक्षण कॉन्फ़िगरेशन पर संगठनों को सलाह दी।

**अगला मील का पत्थर:** मॉड्यूल 5 - एआई प्रोजेक्ट चक्र। आरंभ करने से पहले सुनिश्चित करें कि आपके फीचर निष्कर्षण पाइपलाइन पूरी तरह से अनुकूलित हैं।

${totalXPObtained} XP सुरक्षित करने और अपने क्रेडेंशियल अनलॉक करने पर बधाई!`
          : `### LAB EVALUATION REPORT
**Scientist:** ${state.userName}  
**Badge Status:** Certified Machine Learning Scientist (🧠)  

Your performance across all diagnostic modules is highly commendable. You demonstrated clear analytical capacity inside our virtual chambers, categorizing complex datasets and advising organizations on appropriate learning configurations.

**Next Milestone:** Module 5 - The AI Project Cycle. Ensure your feature extraction pipelines are fully optimized before initializing.

Congratulations on securing ${totalXPObtained} XP and unlocking your credentials!`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [state.userName]);

  return (
    <div className="space-y-8" id="mission-report-container">
      {/* Badge Unlocking Celebration Header */}
      <div className={`p-6 md:p-8 rounded-[2rem] border text-center space-y-4 relative overflow-hidden transition-all duration-1000 ${
        celebrate 
          ? 'glass border-amber-500 shadow-2xl shadow-amber-500/10' 
          : 'glass border-white/10 shadow-xl'
      }`} id="badge-celebration-hero">
        
        {celebrate && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-ping h-2 w-2 rounded-full bg-amber-400"></div>
            <div className="absolute top-1/3 right-1/4 animate-ping h-3 w-3 rounded-full bg-yellow-500 delay-300"></div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`h-24 w-24 rounded-full border-4 flex items-center justify-center text-5xl transition-all duration-1000 select-none ${
            celebrate 
              ? 'bg-amber-500/10 border-amber-500 scale-110 shadow-lg shadow-amber-500/20 animate-pulse' 
              : 'bg-white/5 border-white/10'
          }`} id="giant-badge">
            🧠
          </div>
          
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">{t.credentialLevel}</span>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-display">{t.badgeTitle}</h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              {t.badgeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: XP Breakdown & Detailed AI Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: XP Scoreboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-[2rem] glass shadow-xl space-y-5" id="xp-scoreboard">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" />
              {t.scoreboardTitle}
            </h3>

            <div className="space-y-4">
              {/* Total large stats */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.totalScore}</span>
                <div className="text-4xl font-black text-white mt-1">{totalXPObtained} XP</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1 uppercase">{t.maxAward}</div>
              </div>

              {/* Line items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300">{t.baseCompletion}</span>
                  <span className="font-bold text-white">+{completionXP} XP</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300 flex items-center gap-1">
                    {t.knowledgePerfect}
                    {isPerfectKnowledge ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">{t.ok}</span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-lg font-mono">{t.miss}</span>
                    )}
                  </span>
                  <span className={`font-bold ${isPerfectKnowledge ? 'text-white' : 'text-slate-600'}`}>
                    +{perfectKnowledgeXP} XP
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/10">
                  <span className="text-slate-300 flex items-center gap-1">
                    {t.consultantPerfect}
                    {isPerfectInvs ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold">{t.ok}</span>
                    ) : (
                      <span className="text-[10px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded-lg font-mono">{t.miss}</span>
                    )}
                  </span>
                  <span className={`font-bold ${isPerfectInvs ? 'text-white' : 'text-slate-600'}`}>
                    +{perfectInvsXP} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 5 Progression Announcement */}
          <div className="p-6 rounded-[2rem] glass border border-white/10 space-y-4" id="next-module-roadmap">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Bookmark size={16} />
              {t.roadmapTitle}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.roadmapDesc}
            </p>

            <div className="space-y-2">
              {t.roadmapSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <ChevronRight size={12} className="text-cyan-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle size={12} /> {t.roadmapUnlocked}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Director Evaluation Report */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t.labDossier}</h3>
            <button 
              onClick={fetchReport}
              disabled={loading}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded transition-colors cursor-pointer"
              title="Regenerate Report"
              id="regenerate-report-btn"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="p-8 rounded-[2rem] glass border border-white/10 flex flex-col items-center justify-center space-y-4 min-h-[350px]" id="report-loading">
              <Loader2 className="animate-spin text-cyan-400" size={32} />
              <div className="text-center space-y-1">
                <p className="text-sm font-mono text-slate-300">{t.synthesizing}</p>
                <p className="text-xs text-slate-500 font-mono">{t.digesting}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-[2rem] glass-light border border-white/10 shadow-xl space-y-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[350px]" id="director-report-card">
              <div className="border-b border-white/10 pb-4 mb-4 space-y-1">
                <div>{t.diagnosticsDeck}</div>
                <div className="text-[10px] text-slate-500">REF: MOD.04.REPORT.GENAI.V2</div>
              </div>
              
              <div className="prose prose-sm prose-invert max-w-none text-slate-300 space-y-4" id="report-text-render">
                {reportText.split("\n\n").map((para, i) => {
                  if (para.startsWith("###") || para.startsWith("**")) {
                    return <h4 key={i} className="text-sm font-bold text-white uppercase tracking-wider mt-4">{para.replace(/###|\*\*/g, "").trim()}</h4>;
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
