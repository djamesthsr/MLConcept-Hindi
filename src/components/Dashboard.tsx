import React, { useState } from "react";
import { MissionState } from "../types";
import { 
  Award, 
  Brain, 
  CheckCircle, 
  Clock, 
  Compass, 
  Database, 
  Edit3, 
  FileText, 
  Play, 
  ShieldAlert, 
  TrendingUp, 
  UserCircle 
} from "lucide-react";

interface DashboardProps {
  state: MissionState;
  onNavigate: (tab: string) => void;
  onUpdateName: (name: string) => void;
  language?: "en" | "hi";
}

export default function Dashboard({ state, onNavigate, onUpdateName, language = "hi" }: DashboardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.userName);

  const isHi = language === "hi";

  const t = {
    researchLabActive: isHi ? "अनुसंधान प्रयोगशाला सक्रिय" : "Research Lab Active",
    scientist: isHi ? "वैज्ञानिक" : "Scientist",
    save: isHi ? "सहेजें" : "Save",
    welcomeTitle: isHi ? "मशीन लर्निंग कमांड सेंटर में आपका स्वागत है। अपने डायग्नोस्टिक्स की निगरानी करें, मॉडल आर्किटेक्चर का परीक्षण करें, और मशीनों को सीखने के लिए मार्गदर्शन करें।" : "Welcome to the Machine Learning Command Center. Monitor your diagnostics, test model architectures, and guide machines to learn.",
    totalCompletion: isHi ? "कुल पूर्णता" : "Total Completion",
    steps: isHi ? "चरण" : "Steps",
    scientificXp: isHi ? "अर्जित वैज्ञानिक XP" : "Scientific XP Earned",
    goalXp: isHi ? "लक्ष्य: मास्टर रेटिंग के लिए 120 XP" : "Goal: 120 XP for Master Rating",
    consultantAccuracy: isHi ? "सलाहकार सटीकता" : "Consultant Accuracy",
    casesDiagnosed: isHi ? "मामलों का निदान" : "cases diagnosed",
    earnedCredentials: isHi ? "अर्जित क्रेडेंशियल" : "Earned Credentials",
    uncertified: isHi ? "अप्रमाणित" : "Uncertified",
    unlockText: isHi ? "अनलॉक करने के लिए सभी कार्य पूरे करें" : "Complete all tasks to unlock",
    diagnosticPhases: isHi ? "नैदानिक ​​अनुसंधान चरण" : "Diagnostic Research Phases",
    badgeStatus: isHi ? "वैज्ञानिक बैज स्थिति" : "Scientific Badge Status",
    badgeTitle: isHi ? "मशीन लर्निंग वैज्ञानिक" : "Machine Learning Scientist",
    badgeVerified: isHi ? "क्रेडेंशियल सत्यापित। आप एमएल प्रतिमानों पर संगठनों को सलाह देने के लिए अधिकृत हैं।" : "Credential verified. You are authorized to advise organizations on ML paradigms.",
    badgePending: isHi ? "इस क्रेडेंशियल को अनलॉक करने के लिए सभी प्रयोगशाला मॉड्यूल और निबंध जमा करें।" : "Complete all laboratory modules and reflection prompts to unlock this credential.",
    validationChecklist: isHi ? "सत्यापन चेकलिस्ट" : "Validation Checklist",
    passed: isHi ? "सत्यापित" : "Passed",
    pending: isHi ? "लंबित" : "Pending",
    completeBtn: isHi ? "पूर्ण" : "Complete",
    revisitBtn: isHi ? "पुनः देखें" : "Revisit",
    launchBtn: isHi ? "प्रारंभ करें" : "Launch",
  };

  // Calculate overall progress percentage
  const totalSteps = 8;
  let completedSteps = 0;
  if (state.progress.missionBrief) completedSteps++;
  if (state.progress.learningLab) completedSteps++;
  if (state.progress.knowledgeCheck) completedSteps++;
  if (state.progress.mlInvestigation) completedSteps++;
  if (state.progress.datasetDetective) completedSteps++;
  if (state.progress.workflowChallenge) completedSteps++;
  if (state.progress.journeyTimeline) completedSteps++;
  if (state.progress.reflectionSubmitted) completedSteps++;

  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Accuracy calculation for ML choices
  const totalInvs = Object.keys(state.investigationResults).length;
  const correctInvs = Object.keys(state.investigationResults).filter(key => state.investigationResults[key]?.isCorrect).length;
  const invAccuracy = totalInvs > 0 ? Math.round((correctInvs / totalInvs) * 100) : 0;

  const handleSaveName = () => {
    onUpdateName(tempName);
    setIsEditingName(false);
  };

  const tasks = [
    {
      id: "brief",
      title: isHi ? "मिशन निर्देश (Briefing)" : "Mission Briefing",
      desc: isHi ? "प्रयोगशाला निदेशक से अपना एआई अनुसंधान निर्देश प्राप्त करें।" : "Receive your AI research briefing from the Laboratory Director.",
      icon: FileText,
      completed: state.progress.missionBrief,
      color: "border-indigo-500 text-indigo-400 bg-indigo-950/20",
    },
    {
      id: "lab",
      title: isHi ? "मशीन लर्निंग लैब" : "Machine Learning Lab",
      desc: isHi ? "सुपरवाइज्ड, अनसुपरवाइज्ड और रीइन्फोर्समेंट लर्निंग के द्वारों का अन्वेषण करें।" : "Explore Supervised, Unsupervised, and Reinforcement Learning doors.",
      icon: Brain,
      completed: state.progress.learningLab,
      color: "border-blue-500 text-blue-400 bg-blue-950/20",
    },
    {
      id: "investigation",
      title: isHi ? "परामर्श केस स्टडीज" : "Consulting Case Studies",
      desc: isHi ? "मशीन लर्निंग सलाहकार के रूप में वास्तविक दुनिया के उद्योग मामलों को हल करें।" : "Solve real-world industry cases as a Machine Learning Consultant.",
      icon: Compass,
      completed: state.progress.mlInvestigation,
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/20",
    },
    {
      id: "detective",
      title: isHi ? "डेटासेट जासूस (Dataset Detective)" : "Dataset Detective",
      desc: isHi ? "शोध डेटासेट को वर्गीकृत करें और मुख्य एआई वर्कफ़्लो को क्रमित करें।" : "Classify research datasets and order the core AI workflow.",
      icon: Database,
      completed: state.progress.datasetDetective && state.progress.workflowChallenge,
      color: "border-amber-500 text-amber-400 bg-amber-950/20",
    },
    {
      id: "journey",
      title: isHi ? "यात्रा और प्रतिबिंब निबंध" : "Journey & Reflection",
      desc: isHi ? "आधुनिक एआई उपयोग मामलों का विश्लेषण करें और अपना वैज्ञानिक निबंध प्रस्तुत करें।" : "Analyze modern AI use cases and submit your scientific essay.",
      icon: TrendingUp,
      completed: state.progress.journeyTimeline && state.progress.reflectionSubmitted,
      color: "border-purple-500 text-purple-400 bg-purple-950/20",
    },
  ];

  const checklistItems = [
    { label: isHi ? "निर्देश प्राप्त हुए" : "Briefing Received", checked: state.progress.missionBrief },
    { label: isHi ? "एमएल लैब्स का निरीक्षण किया गया" : "ML Labs Inspected", checked: state.progress.learningLab },
    { label: isHi ? "ज्ञान परीक्षण पूर्ण हुआ" : "Knowledge Check Completed", checked: state.progress.knowledgeCheck },
    { label: isHi ? "5 परामर्श हल किए गए" : "5 Consultants Solved", checked: state.progress.mlInvestigation },
    { label: isHi ? "डेटासेट वर्गीकृत किए गए" : "Confidential Datasets Classified", checked: state.progress.datasetDetective },
    { label: isHi ? "एमएल वर्कफ़्लो क्रमबद्ध किया गया" : "ML Workflow Sorted", checked: state.progress.workflowChallenge },
    { label: isHi ? "कार्यप्रवाह समयरेखा देखी गई" : "Workflow Timeline Visited", checked: state.progress.journeyTimeline },
    { label: isHi ? "शोध निबंध प्रस्तुत किए गए" : "Research Essays Submitted", checked: state.progress.reflectionSubmitted },
  ];

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Personalized Header Card */}
      <div className="relative p-6 md:p-8 rounded-[2rem] glass overflow-hidden" id="dashboard-welcome-card">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400 pointer-events-none">
          <Brain size={192} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-wider uppercase font-mono">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              {t.researchLabActive}
            </div>
            
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1 bg-white/10 border border-cyan-400 rounded-xl text-xl text-white focus:outline-none"
                    maxLength={25}
                    id="edit-name-input"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-xs rounded-lg font-bold text-slate-950 transition-colors"
                    id="save-name-btn"
                  >
                    {t.save}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight font-display" id="user-display-name">
                    {t.scientist} {state.userName}
                  </h1>
                  <button 
                    onClick={() => { setTempName(state.userName); setIsEditingName(true); }}
                    className="p-1 text-slate-300 hover:text-cyan-400 transition-colors"
                    title={isHi ? "नाम बदलें" : "Edit Name"}
                    id="edit-name-trigger"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              {t.welcomeTitle}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
            <div className="relative flex items-center justify-center">
              {/* Radial Progress */}
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-white/10 fill-none" strokeWidth="4" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-cyan-400 fill-none transition-all duration-1000" 
                  strokeWidth="4" 
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercentage / 100)}
                />
              </svg>
              <span className="absolute text-sm font-bold text-cyan-300">{progressPercentage}%</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold font-mono">{t.totalCompletion}</div>
              <div className="text-lg font-bold text-slate-100">{completedSteps} / {totalSteps} {t.steps}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-stats-grid">
        {/* XP Stat Card */}
        <div className="p-6 rounded-[2rem] glass flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold font-mono">{t.scientificXp}</div>
            <div className="text-2xl font-extrabold text-white">{state.xp} XP</div>
            <div className="text-xs text-cyan-400 font-medium">{t.goalXp}</div>
          </div>
        </div>

        {/* Model Accuracy Stat Card */}
        <div className="p-6 rounded-[2rem] glass flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Compass size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold font-mono">{t.consultantAccuracy}</div>
            <div className="text-2xl font-extrabold text-white">{totalInvs > 0 ? `${invAccuracy}%` : "---"}</div>
            <div className="text-xs text-slate-400">
              {totalInvs} / 5 {t.casesDiagnosed}
            </div>
          </div>
        </div>

        {/* Badge Stat Card */}
        <div className={`p-6 rounded-[2rem] glass flex items-center gap-4 transition-all ${state.badgeUnlocked ? 'shadow-lg shadow-amber-500/10' : ''}`}>
          <div className={`p-3 rounded-xl ${state.badgeUnlocked ? 'bg-amber-400/20 text-amber-400 border-amber-500/30 animate-pulse' : 'bg-white/5 text-slate-400 border-white/10'} border`}>
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold font-mono">{t.earnedCredentials}</div>
            <div className="text-lg font-bold text-white truncate">
              {state.badgeUnlocked ? `🧠 ${t.badgeTitle}` : t.uncertified}
            </div>
            <div className="text-xs text-slate-400">
              {state.badgeUnlocked ? "Module 4 Badge Unlocked" : t.unlockText}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Interactive Task Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Tasks list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-display">
            <Compass className="text-cyan-400" size={20} />
            {t.diagnosticPhases}
          </h2>
          
          <div className="space-y-4">
            {tasks.map((task) => {
              const Icon = task.icon;
              return (
                <div 
                  key={task.id} 
                  className="p-5 rounded-2xl glass transition-all duration-300 hover:border-white/20 hover:shadow-lg"
                  id={`task-card-${task.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border ${task.color} glass-light`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base font-display">{task.title}</h3>
                          {task.completed && (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30 font-mono uppercase">
                              <CheckCircle size={10} />
                              {t.completeBtn}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{task.desc}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onNavigate(task.id)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shrink-0 ${
                        task.completed 
                        ? "bg-white/10 hover:bg-white/20 text-slate-200" 
                        : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/10"
                      }`}
                      id={`launch-${task.id}`}
                    >
                      {task.completed ? t.revisitBtn : t.launchBtn}
                      <Play size={12} className="fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Scientific Progress Track & Badge Display */}
        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] glass space-y-4" id="badge-display-panel">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <Award className="text-amber-400" size={20} />
              {t.badgeStatus}
            </h2>
            
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className={`relative p-8 rounded-full border-2 transition-all duration-1000 ${
                state.badgeUnlocked 
                ? "bg-amber-400/10 border-amber-500 shadow-xl shadow-amber-400/20 animate-pulse" 
                : "bg-white/5 border-white/10 grayscale"
              }`}>
                <span className="text-6xl select-none leading-none">🧠</span>
                {state.badgeUnlocked && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-xs font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">
                    OK
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="font-extrabold text-lg text-white font-display">{t.badgeTitle}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-[240px]">
                  {state.badgeUnlocked 
                    ? t.badgeVerified 
                    : t.badgePending
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] glass space-y-4" id="lab-checklist-panel">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <CheckCircle className="text-cyan-400" size={20} />
              {t.validationChecklist}
            </h2>
            <div className="space-y-3">
              {checklistItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5">
                  <span className={item.checked ? "text-slate-200" : "text-slate-400"}>{item.label}</span>
                  {item.checked ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                      <CheckCircle size={14} /> {t.passed}
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1 text-xs font-mono">
                      <Clock size={14} /> {t.pending}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
