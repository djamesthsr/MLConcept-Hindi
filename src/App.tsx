import React, { useState, useEffect } from "react";
import { MissionState, InvestigationResult } from "./types";
import Dashboard from "./components/Dashboard";
import MissionBrief from "./components/MissionBrief";
import LearningLab from "./components/LearningLab";
import MLInvestigation from "./components/MLInvestigation";
import DatasetDetective from "./components/DatasetDetective";
import MachineLearningJourney from "./components/MachineLearningJourney";
import MissionReport from "./components/MissionReport";
import { 
  Brain, 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Database, 
  TrendingUp, 
  Award, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";

const LOCAL_STORAGE_KEY = "ml_concepts_lab_progress_v1";

const defaultState: MissionState = {
  userName: "Name",
  xp: 0,
  badgeUnlocked: false,
  currentTab: "dashboard",
  progress: {
    missionBrief: false,
    learningLab: false,
    knowledgeCheck: false,
    knowledgeCheckScore: 0,
    mlInvestigation: false,
    datasetDetective: false,
    workflowChallenge: false,
    journeyTimeline: false,
    reflectionSubmitted: false
  },
  answers: {
    labQuestions: {},
    knowledgeCheck: {},
    datasetDetective: {},
    workflowOrder: [],
    journeyQuiz: {}
  },
  reflections: {
    interest: "",
    dailyLife: "",
    goodData: "",
    workflowWhy: ""
  },
  investigationResults: {}
};

export default function App() {
  const [state, setState] = useState<MissionState>(defaultState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("hi");

  // Load progress on mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure robust structure
        setState({
          ...defaultState,
          ...parsed,
          progress: { ...defaultState.progress, ...(parsed.progress || {}) },
          answers: { ...defaultState.answers, ...(parsed.answers || {}) },
          reflections: { ...defaultState.reflections, ...(parsed.reflections || {}) },
          investigationResults: parsed.investigationResults || {}
        });
      } catch (e) {
        console.error("Failed to parse progress cache", e);
      }
    }
    
    // Check if user has previously set language preference
    const cachedLang = localStorage.getItem("ml_hub_lang");
    if (cachedLang === "en" || cachedLang === "hi") {
      setLanguage(cachedLang);
    }
  }, []);

  const handleSetLanguage = (lang: "en" | "hi") => {
    setLanguage(lang);
    localStorage.setItem("ml_hub_lang", lang);
  };

  // Save progress on state change reactively
  useEffect(() => {
    if (state !== defaultState) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleUpdateName = (newName: string) => {
    setState(prev => ({ ...prev, userName: newName }));
  };

  const handleNavigate = (tab: string) => {
    setState(prev => ({ ...prev, currentTab: tab }));
    setSidebarOpen(false);
  };

  // Gamification: State-triggering XP logs
  const handleCompleteBrief = () => {
    setState(prev => {
      if (prev.progress.missionBrief) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, missionBrief: true },
        xp: prev.xp + 10
      };
    });
  };

  const handleCompleteLab = () => {
    setState(prev => {
      if (prev.progress.learningLab) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, learningLab: true },
        xp: prev.xp + 10
      };
    });
  };

  const handleCompleteKnowledgeCheck = (score: number) => {
    setState(prev => {
      const alreadyDone = prev.progress.knowledgeCheck;
      const isPerfect = score === 100;
      
      let xpGain = 0;
      if (!alreadyDone) {
        xpGain += 10; // Base complete
      }
      if (isPerfect && prev.progress.knowledgeCheckScore < 100) {
        xpGain += 20; // Perfect bonus
      }

      return {
        ...prev,
        progress: { 
          ...prev.progress, 
          knowledgeCheck: true, 
          knowledgeCheckScore: Math.max(prev.progress.knowledgeCheckScore, score) 
        },
        xp: prev.xp + xpGain
      };
    });
  };

  const handleSaveInvestigationResult = (orgId: string, result: InvestigationResult) => {
    setState(prev => {
      const nextInvs = { ...prev.investigationResults, [orgId]: result };
      return { ...prev, investigationResults: nextInvs };
    });
  };

  const handleCompleteInvestigation = () => {
    setState(prev => {
      if (prev.progress.mlInvestigation) return prev;
      
      // Check if perfect score of 5
      const correctCount = Object.keys(prev.investigationResults).filter(key => prev.investigationResults[key]?.isCorrect).length;
      let bonusXP = 0;
      if (correctCount === 5) {
        bonusXP = 20; // Perfect consultation award
      }

      return {
        ...prev,
        progress: { ...prev.progress, mlInvestigation: true },
        xp: prev.xp + 20 + bonusXP
      };
    });
  };

  const handleCompleteDetective = () => {
    setState(prev => {
      if (prev.progress.datasetDetective) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, datasetDetective: true },
        xp: prev.xp + 15
      };
    });
  };

  const handleCompleteWorkflow = (essay: string) => {
    setState(prev => {
      if (prev.progress.workflowChallenge) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, workflowChallenge: true },
        reflections: { ...prev.reflections, workflowWhy: essay },
        xp: prev.xp + 15
      };
    });
  };

  const handleViewTimeline = () => {
    setState(prev => {
      if (prev.progress.journeyTimeline) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, journeyTimeline: true },
        xp: prev.xp + 10
      };
    });
  };

  const handleCompleteReflection = (essays: { interest: string; dailyLife: string; goodData: string }) => {
    setState(prev => {
      if (prev.progress.reflectionSubmitted) return prev;
      return {
        ...prev,
        progress: { ...prev.progress, reflectionSubmitted: true },
        reflections: { 
          ...prev.reflections, 
          interest: essays.interest,
          dailyLife: essays.dailyLife,
          goodData: essays.goodData
        },
        xp: prev.xp + 20
      };
    });
  };

  const handleUnlockBadge = () => {
    setState(prev => {
      if (prev.badgeUnlocked) return prev;
      return { ...prev, badgeUnlocked: true };
    });
  };

  const handleResetProgress = () => {
    const msg = language === "en" 
      ? "Are you sure you want to recalibrate? This will erase all XP and metrics." 
      : "क्या आप वाकई रीकैलिब्रेट करना चाहते हैं? इससे सभी XP और मेट्रिक्स मिट जाएंगे।";
    if (confirm(msg)) {
      setState(defaultState);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Nav side links (Dynamic language translation)
  const navLinks = [
    { id: "dashboard", name: language === "en" ? "Dashboard Hub" : "मुख्य डैशबोर्ड", icon: LayoutDashboard },
    { id: "brief", name: language === "en" ? "Mission Brief" : "मिशन निर्देश", icon: FileText },
    { id: "lab", name: language === "en" ? "ML Cognitive Lab" : "एमएल संज्ञानात्मक लैब", icon: HelpCircle },
    { id: "investigation", name: language === "en" ? "ML Consultant" : "एमएल सलाहकार", icon: Compass },
    { id: "detective", name: language === "en" ? "Dataset Detective" : "डेटासेट जासूस", icon: Database },
    { id: "journey", name: language === "en" ? "Journey & Essays" : "यात्रा और निबंध", icon: TrendingUp },
    { id: "report", name: language === "en" ? "Laboratory Report" : "प्रयोगशाला रिपोर्ट", icon: Award },
  ];

  return (
    <div className="min-h-screen app-root-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Banner Control Rail */}
      <header className="border-b border-white/10 glass px-6 py-4 sticky top-0 z-40 flex items-center justify-between" id="global-header">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-white/10 text-slate-300 hover:text-white rounded lg:hidden"
            title="Menu"
            id="mobile-menu-trigger"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <Brain size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-cyan-400 tracking-widest uppercase">
                {language === "en" ? "COGNITIVE INTERFACE" : "संज्ञानात्मक इंटरफ़ेस"}
              </span>
              <h1 className="text-sm font-bold text-white tracking-tight uppercase font-display">
                {language === "en" ? "ML Concepts Hub" : "एमएल संकल्पना केंद्र"}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Toggle Button */}
          <button
            onClick={() => handleSetLanguage(language === "en" ? "hi" : "en")}
            className="px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all"
            id="lang-toggle-btn"
            title={language === "en" ? "हिन्दी में अनुवाद करें" : "Translate to English"}
          >
            🌐 <span className="font-sans">{language === "en" ? "हिन्दी" : "English"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-300">
            <span>{state.xp} XP</span>
          </div>

          <div className="text-xs text-slate-300 font-mono hidden md:block border-l border-white/10 pl-4">
            {language === "en" ? "USER" : "यूज़र"}: <span className="text-cyan-400 font-bold">{state.userName}</span>
          </div>

          <button
            onClick={handleResetProgress}
            className="text-[10px] text-slate-400 hover:text-red-400 font-mono transition-colors uppercase border border-white/10 px-2 py-1 rounded hover:border-red-500/30 bg-white/5"
            id="reset-progress-btn"
          >
            {language === "en" ? "Recalibrate Hub" : "हब रीसेट करें"}
          </button>
        </div>
      </header>

      {/* Main Structural split */}
      <div className="flex-1 flex relative">
        
        {/* Navigation Sidebar Drawer */}
        <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-slate-950/40 border-r border-white/10 p-5 flex flex-col justify-between h-[calc(100vh-69px)] lg:h-[calc(100vh-73px)] lg:sticky lg:top-[73px]`} id="navigation-sidebar">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                {language === "en" ? "LAB DIRECTORY" : "लैब निर्देशिका"}
              </span>
              <p className="text-xs text-slate-300">
                {language === "en" ? "Section 04: ML Scientist" : "अनुभाग 04: एमएल वैज्ञानिक"}
              </p>
            </div>

            <nav className="space-y-1.5" id="sidebar-nav-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = state.currentTab === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 font-bold' 
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    id={`nav-link-${link.id}`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    {link.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{language === "en" ? "SYSTEM: SECURE" : "सिस्टम: सुरक्षित"}</span>
            </div>
            <div>{language === "en" ? "STREAK: ACTIVE" : "सक्रिय दिन: सक्रिय"}</div>
            <div>{language === "en" ? "VER: 4.1.0-LAB" : "संस्करण: 4.1.0-लैब"}</div>
          </div>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full" id="viewport-stage">
          {state.currentTab === "dashboard" && (
            <Dashboard 
              state={state} 
              onNavigate={handleNavigate}
              onUpdateName={handleUpdateName}
              language={language}
            />
          )}

          {state.currentTab === "brief" && (
            <MissionBrief 
              userName={state.userName}
              isCompleted={state.progress.missionBrief}
              onComplete={handleCompleteBrief}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {state.currentTab === "lab" && (
            <LearningLab 
              labCompleted={state.progress.learningLab}
              knowledgeCheckCompleted={state.progress.knowledgeCheck}
              knowledgeCheckScore={state.progress.knowledgeCheckScore}
              onCompleteLab={handleCompleteLab}
              onCompleteKnowledgeCheck={handleCompleteKnowledgeCheck}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {state.currentTab === "investigation" && (
            <MLInvestigation 
              investigationResults={state.investigationResults}
              isCompleted={state.progress.mlInvestigation}
              onSaveResult={handleSaveInvestigationResult}
              onCompleteInvestigation={handleCompleteInvestigation}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {state.currentTab === "detective" && (
            <DatasetDetective 
              detectiveCompleted={state.progress.datasetDetective}
              workflowCompleted={state.progress.workflowChallenge}
              onCompleteDetective={handleCompleteDetective}
              onCompleteWorkflow={handleCompleteWorkflow}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {state.currentTab === "journey" && (
            <MachineLearningJourney 
              timelineViewed={state.progress.journeyTimeline}
              reflectionCompleted={state.progress.reflectionSubmitted}
              onViewTimeline={handleViewTimeline}
              onCompleteReflection={handleCompleteReflection}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {state.currentTab === "report" && (
            <MissionReport 
              state={state}
              onNavigate={handleNavigate}
              onUnlockBadge={handleUnlockBadge}
              language={language}
            />
          )}
        </main>
      </div>
    </div>
  );
}
