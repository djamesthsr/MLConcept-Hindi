import React, { useEffect, useState } from "react";
import { Terminal, Shield, Play, RefreshCw, Loader2, Award } from "lucide-react";

interface MissionBriefProps {
  userName: string;
  isCompleted: boolean;
  onComplete: () => void;
  onNavigate: (tab: string) => void;
  language?: "en" | "hi";
}

export default function MissionBrief({ userName, isCompleted, onComplete, onNavigate, language = "hi" }: MissionBriefProps) {
  const [briefText, setBriefText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);

  const isHi = language === "hi";

  const t = {
    loadingBrief: isHi ? "होलोग्राफिक निर्देश प्रसारित किया जा रहा है..." : "Transmitting holographic briefing...",
    doNotDisconnect: isHi ? "टर्मिनल फीड को डिस्कनेक्ट न करें।" : "Do not disconnect terminal feed.",
    received: isHi ? "निदेशालय संचरण प्राप्त हुआ" : "DIRECTORATE TRANSMISSION RECEIVED",
    backupLoaded: isHi ? "ऑफ़लाइन बैकअप निर्देश लोड किया गया।" : "Offline backup briefing loaded.",
    rewardTitle: isHi ? "मिशन वैज्ञानिक पुरस्कार" : "Mission Scientific Reward",
    rewardDesc: isHi ? "मिशन निर्देश पढ़ने से आप एक सक्रिय अन्वेषक के रूप में पंजीकृत होते हैं और आपको 10 XP मिलते हैं।" : "Reading the mission briefing registers you as an active investigator and awards 10 XP.",
    proceedBtn: isHi ? "प्रयोगशाला द्वारों पर आगे बढ़ें" : "Proceed to Laboratory Doors",
    regenerateBtn: isHi ? "निर्देश पुनः उत्पन्न करें" : "Regenerate Briefing",
    labSector: isHi ? "अनुभाग 04 // मशीन लर्निंग संज्ञान" : "SECTOR 04 // MACHINE LEARNING COGNITION",
    uplink: isHi ? "स्थिति: अपलिंक स्थापित" : "STATUS: UPLINK ESTABLISHED",
    encryption: isHi ? "एन्क्रिप्शन स्तर: सुरक्षित" : "ENCRYPTION LEVEL: SECURE",
    secureLink: isHi ? "सुरक्षित संचार लिंक" : "Secure Communication Link",
    labTitle: isHi ? "एआई रिसर्च लैब" : "AI Research Lab",
  };

  const mockLogs = isHi ? [
    "एआई इनोवेशन रिसर्च लैब के साथ सुरक्षित कक्षीय रिले स्थापित किया जा रहा है...",
    "वैज्ञानिक क्रेडेंशियल के लिए डेटाबेस को क्वेरी किया जा रहा है...",
    "वैज्ञानिक प्रोफाइल मिलान: कोड नाम " + userName,
    "प्रमुख क्षमता निर्देशों को इनलाइन किया जा रहा है (SERVER_SIDE_GEMINI_API)...",
    "जेमिनी संज्ञानात्मक सब-ग्रिड से जुड़ा जा रहा है...",
    "कस्टम मिशन निर्देश उत्पन्न किया जा रहा है...",
  ] : [
    "Establishing secure orbital relay with AI Innovation Research Lab...",
    "Querying database for Scientist credentials...",
    "Scientist profile matched: Code Name " + userName,
    "Inlining major capability directives (SERVER_SIDE_GEMINI_API)...",
    "Connecting to Gemini cognitive sub-grid...",
    "Generating custom mission briefing...",
  ];

  const fetchBrief = async () => {
    setLoading(true);
    setBriefText("");
    setErrorOccurred(false);
    
    // Animate some terminal log lines first for deep immersion
    setLogs([]);
    for (let i = 0; i < mockLogs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLogs((prev) => [...prev, `[LOG] ${mockLogs[i]}`]);
    }

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, language }),
      });
      const data = await response.json();
      if (data.brief) {
        setBriefText(data.brief);
      } else {
        throw new Error("No briefing found");
      }
    } catch (e) {
      console.error(e);
      setErrorOccurred(true);
      // Fallback
      setBriefText(
        isHi
          ? "एआई अनुसंधान प्रयोगशाला में आपका स्वागत है, वैज्ञानिक आपका कार्य यह जांचना है कि मशीनें विभिन्न प्रकार के डेटासेट से कैसे सीखती हैं: लेबल वाले उदाहरणों (सुपरवाइज्ड) का उपयोग करना, क्लस्टर खोजना (अनसुपरवाइज्ड), और परीक्षण-और-त्रुटि पुरस्कार (रीइन्फोर्समेंट) के माध्यम से प्रशिक्षण। अपनी जांच शुरू करने के लिए अपने क्रेडेंशियल सुरक्षित करें और प्रयोगशाला के दरवाजे में प्रवेश करें।"
          : "Welcome to the AI Research Lab, Scientist. Your task is to investigate how machines learn from different types of datasets: using labeled examples (Supervised), discovering clusters (Unsupervised), and training via trial-and-error rewards (Reinforcement). Secure your credentials and enter the laboratory doors to initiate your investigation."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [userName, language]);

  const handleStartMission = () => {
    if (!isCompleted) {
      onComplete(); // Triggers XP reward and marks complete
    }
    onNavigate("lab");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="mission-brief-container">
      {/* Immersive Lab Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Terminal size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase font-display">{t.labTitle}</h1>
            <p className="text-xs text-slate-400 font-mono">{t.labSector}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-500 font-mono">{t.encryption}</div>
          <div className="text-xs text-cyan-400 font-mono">{t.uplink}</div>
        </div>
      </div>

      {/* Loading Console Terminal */}
      {loading ? (
        <div className="p-6 rounded-[2rem] glass font-mono text-sm text-cyan-300 min-h-[300px] flex flex-col justify-between" id="brief-loading-terminal">
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-xs text-slate-400">
              <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
              <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-mono uppercase tracking-wider">{t.secureLink}</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="animate-fade-in">{log}</div>
            ))}
            <div className="flex items-center gap-2 mt-4 text-slate-200">
              <Loader2 className="animate-spin text-cyan-400" size={16} />
              <span>{t.loadingBrief}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-6 pt-2 border-t border-white/10">
            {t.doNotDisconnect}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Brief Card */}
          <div className="p-6 md:p-8 rounded-[2rem] glass shadow-xl space-y-6 relative overflow-hidden" id="briefing-card">
            <div className="absolute top-0 right-0 p-6 text-cyan-400 opacity-5 pointer-events-none">
              <Shield size={120} />
            </div>

            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {t.received}
            </div>

            {/* Generated Briefing text */}
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-base leading-relaxed" id="brief-text-content">
              {briefText.split("\n\n").map((para, i) => {
                if (para.startsWith("###") || para.startsWith("**")) {
                  return <h3 key={i} className="text-xl font-bold text-white tracking-tight mt-6 font-display">{para.replace(/###|\*\*/g, "").trim()}</h3>;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>

            {errorOccurred && (
              <div className="text-xs text-slate-500 italic mt-2 font-mono">
                {t.backupLoaded}
              </div>
            )}

            {/* Scientific Reward Highlight */}
            <div className="p-4 rounded-2xl glass-light border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-cyan-400">
                <Award size={18} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.rewardTitle}</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t.rewardDesc}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/10">
              <button
                onClick={handleStartMission}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all text-sm"
                id="start-exploring-btn"
              >
                {t.proceedBtn}
                <Play size={16} className="fill-current" />
              </button>
              
              <button
                onClick={fetchBrief}
                className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
                id="refresh-brief-btn"
              >
                <RefreshCw size={14} />
                {t.regenerateBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
