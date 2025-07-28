import React, { useEffect, useState } from 'react';
import { Mic, Zap, Computer, Building, DollarSign, Settings, Heart, Scale, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';
import toast from 'react-hot-toast';
import UpdateProfileModal from '../components/UpdateProfileModal';
import GithubProjectModal from '../components/GithubProjectModal';
import { useInterviewStore } from '../store/useInterviewStore';
import { useGithubProjectStore } from '../store/useGithubProjectStore';

const categories = [
  { id: 'tech', label: 'Tech & Programming', icon: Computer },
  { id: 'upsc', label: 'UPSC & Government', icon: Building },
  { id: 'business', label: 'Business & Finance', icon: DollarSign },
  { id: 'engineering', label: 'Engineering', icon: Settings },
  { id: 'medical', label: 'Medical & Healthcare', icon: Heart },
  { id: 'law', label: 'Law & Legal', icon: Scale },
  { id: 'data', label: 'Data Science & AI', icon: BarChart3 },
  { id: 'marketing', label: 'Marketing & Sales', icon: TrendingUp }
];

// Map categories to topics and subtopics
const categoryTopics = {
  tech: { topic: 'Tech & Programming', subtopic: 'Web Development' },
  upsc: { topic: 'UPSC & Government', subtopic: 'General Studies' },
  business: { topic: 'Business & Finance', subtopic: 'Entrepreneurship' },
  engineering: { topic: 'Engineering', subtopic: 'Mechanical Engineering' },
  medical: { topic: 'Medical & Healthcare', subtopic: 'Pharmacology' },
  law: { topic: 'Law & Legal', subtopic: 'Constitutional Law' },
  data: { topic: 'Data Science & AI', subtopic: 'Machine Learning' },
  marketing: { topic: 'Marketing & Sales', subtopic: 'Digital Marketing' },
};

const Start = () => {
  const { user } = useAuthStore();
  const { setOpenModal } = useModalStore();
  const navigate = useNavigate();
  const {isGettingResume,resumeData,randomTopic,getRandomTopic,readResume,setInterviewData,generateQuestion,isGeneratingQuestion,isStartingInterview,getLeetCodeAnalysis,isGettingLeetCodeAnalysis,startCustomInterview} = useInterviewStore()
  const {githubProjects} = useGithubProjectStore()


  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [includeResume, setIncludeResume] = useState(!!(user && user.resume && user.resume.endsWith('.pdf')));
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [numQuestions, setNumQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState('easy');
  const [showLeetModal, setShowLeetModal] = useState(false);
  const [leetToggle, setLeetToggle] = useState(!!user?.leetcodeUsername);
  const [isGeneratingRandomTopic,setIsGeneratingRandomTopic] = useState(false);
  const [githubToggle, setGithubToggle] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  useEffect(() => {
    setLeetToggle(!!user?.leetcodeUsername);
    const hasGithubProjects = !!githubProjects && githubProjects.length > 0;
    setGithubToggle(hasGithubProjects);
  }, [user?.leetcodeUsername, githubProjects]);



  const handleStartClick = async () => {
    if (!user) {
      setOpenModal(); 
      return;
    }
    if(user.interviewLeft==0 && user.subscription!=='pro'){
      toast.error("You don't have credits")
      navigate('/pricing')
      return;
    }

    
    let leet = 'no leetcode stats included';
    if(leetToggle && user?.leetcodeUsername){
      leet = await getLeetCodeAnalysis(user.leetcodeUsername);
    }
    let resume = 'no resume included';
    if(includeResume){
      if(!resumeData){
        resume = await readResume(user.resume)
      }else{
        resume = resumeData;
      }
    }

    let github;
    if(githubToggle && githubProjects && githubProjects.length > 0){
      github = JSON.stringify(githubProjects.map(project => ({
        url: project.url,
        analysis: project.analysis,
        tree: project.tree
      })));
    }else{
      github = 'no github projects included';
    }



    const interviewData = {
      topic,
      subTopic,
      level:difficulty,
      amount:numQuestions,
      resume,
      leetcode:leet,
      github
    }
    console.log(interviewData);
    const interview = await generateQuestion(interviewData)
    if(!interview){
      return;
    }
    setInterviewData(interview)

    // Ensure questions is always an array

    const questions = Array.isArray(interview.questions) ? interview.questions : [];
    const call = await startCustomInterview(questions, leet, resume, github, user?.name);
    if(call){
      navigate(`/interview/id=${interview._id}`);
    }
  };

  // Autofill topic/subtopic on category click
  const handleCategoryClick = (categoryId) => {
    const cat = categoryTopics[categoryId];
    if (cat) {
      setTopic(cat.topic);
      setSubTopic(cat.subtopic);
    }
  };

  // Generate random topic/subtopic
  const handleRandomTopic = async () => {
    if (!user.resume || user.resume === "") {
      return;
    }
    setIsGeneratingRandomTopic(true);
    // If topics already exist, use them
    if (randomTopic && Array.isArray(randomTopic) && randomTopic.length > 0) {
      const randomIdx = Math.floor(Math.random() * randomTopic.length);
      const selected = randomTopic[randomIdx];
      setTopic(selected.topic || '');
      setSubTopic(selected.subtopic || '');
    } else {
      let resumeText = resumeData;
      if (!resumeText) {
        resumeText = await readResume(user.resume);
      }
      // Use the returned topics directly
      const topics = await getRandomTopic(resumeText);
      if (topics && Array.isArray(topics) && topics.length > 0) {
        const randomIdx = Math.floor(Math.random() * topics.length);
        const selected = topics[randomIdx];
        setTopic(selected.topic || '');
        setSubTopic(selected.subtopic || '');
      }
    }
    setIsGeneratingRandomTopic(false);
  };

  // Handle resume toggle
  const handleResumeToggle = () => {
    if (includeResume) {
      setIncludeResume(false);
    } else {
      if (user && user.resume && user.resume.endsWith('.pdf')) {
        setIncludeResume(true);
      } else {
        toast("Add your resume")
        setShowResumeModal(true);
      }
    }
  };

  // When resume is uploaded, turn toggle ON
  const handleResumeModalClose = () => {
    setShowResumeModal(false);
    if (user && user.resume && user.resume.endsWith('.pdf')) {
      setIncludeResume(true);
    }
  };

  // Add a function to unlink LeetCode
  const handleLeetToggle = () => {
    if (!leetToggle && !user?.leetcodeUsername) {
      setShowLeetModal(true);
    }else{
      setLeetToggle((prev) => !prev);
    }
  };

  const handleGithubToggle = () => {
    // If no GitHub projects, open modal to add projects
    if(!githubProjects || githubProjects.length === 0){
      setShowGithubModal(true);
      return;
    }
    
    // If there are GitHub projects, toggle the state
    setGithubToggle((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-base-200 font-inter">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">Choose Your Topic</h2>
          <p className="text-base-content/70 text-lg">
            Select trending categories or specify your own topic for AI-generated interview questions
          </p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Popular Categories */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-6">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Show only 4 categories on mobile, all on md+ */}
              {categories.map((category, idx) => {
                const IconComponent = category.icon;
                // On mobile, only show first 4
                if (idx > 3) {
                  return (
                    <div
                      key={category.id}
                      className="hidden md:block p-4 rounded-xl border-2 border-base-200 bg-base-200 text-primary text-left shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <IconComponent className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium text-base-content">{category.label}</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={category.id}
                    className="p-4 rounded-xl border-2 border-base-200 bg-base-200 text-primary text-left shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium text-base-content">{category.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resume and LeetCode Options - side by side on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Resume Box */}
            <div className="flex-1 rounded-xl border border-primary/30 bg-base-200 p-6 flex flex-col items-start gap-2 shadow-sm">
              <span className="font-bold text-lg flex items-center gap-2 text-primary">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" /></svg>
                Resume Analysis
              </span>
              {user && user.resume && user.resume.endsWith('.pdf') ? (
                <div className="flex items-center gap-2 mt-1">
                  <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">View Resume</a>
                  <span className="badge badge-success text-xs font-semibold">Uploaded</span>
                </div>
              ) : (
                <span className="text-base-content/70 text-sm mt-1">No resume uploaded. Upload to include in your interview.</span>
              )}
              <div className="flex flex-col items-center gap-2 mt-2 w-full">
                <input
                  type="checkbox"
                  className="toggle toggle-lg toggle-primary"
                  checked={includeResume}
                  onChange={handleResumeToggle}
                  id="resume-toggle"
                />
                <label htmlFor="resume-toggle" className="text-xs text-base-content/70">{includeResume ? 'Included' : 'Not Included'}</label>
                {includeResume && !(user && user.resume && user.resume.endsWith('.pdf')) && (
                  <span className="text-error text-xs mt-1">Please upload your resume to enable this option.</span>
                )}
              </div>
            </div>
            {/* LeetCode Box */}
            <div className="flex-1 rounded-xl border border-warning/30 bg-base-200 p-6 flex flex-col items-start gap-2 shadow-sm">
              <span className="font-bold text-lg flex items-center gap-2 text-warning">
                <img src="https://leetcode.com/static/images/LeetCode_logo_rvs.png" alt="LeetCode" className="w-6 h-6 object-contain" />
                LeetCode Analysis
              </span>
              {user?.leetcodeUsername ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-success text-xs font-semibold">{user.leetcodeUsername}</span>
                  <span className="text-success/70">Linked</span>
                </div>
              ) : (
                <span className="text-base-content/70 text-sm mt-1">Link your LeetCode profile to personalize your interview experience.</span>
              )}
              <div className="flex flex-col items-center gap-2 mt-2 w-full">
                <input
                  type="checkbox"
                  className="toggle toggle-lg toggle-warning"
                  checked={leetToggle}
                  onChange={handleLeetToggle}
                  id="leetcode-toggle"
                />
                <label htmlFor="leetcode-toggle" className="text-xs text-base-content/70 flex items-center gap-1">
                  {user?.leetcodeUsername ? 'LeetCode Linked' : 'Analyze LeetCode'}
                </label>
              </div>
            </div>
          </div>

          {/* GitHub Analysis */}
          <div className="rounded-xl border border-info/30 bg-base-200 p-6 flex flex-col items-start gap-2 shadow-sm">
            <span className="font-bold text-lg flex items-center gap-2 text-info">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              GitHub Project Analysis
            </span>
            {githubProjects && githubProjects.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-success text-xs font-semibold">{githubProjects.length} Project{githubProjects.length > 1 ? 's' : ''}</span>
                <span className="text-success/70">Added</span>
              </div>
            ) : (
              <span className="text-base-content/70 text-sm mt-1">Add your GitHub projects to personalize your interview experience.</span>
            )}
            <div className="flex flex-col items-center gap-2 mt-2 w-full">
              <input
                type="checkbox"
                className="toggle toggle-lg toggle-info"
                checked={githubToggle}
                onChange={handleGithubToggle}
                id="github-toggle"
              />
              <label htmlFor="github-toggle" className="text-xs text-base-content/70 flex items-center gap-1">
                {githubProjects && githubProjects.length > 0 ? 'GitHub Projects Added' : 'Add GitHub Projects'}
              </label>
              {githubProjects && githubProjects.length > 0 && (
                <button
                  onClick={() => setShowGithubModal(true)}
                  className="btn btn-outline btn-info btn-sm mt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Change Repos
                </button>
              )}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-4">Specify Your Topic</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your topic..."
                className="w-full px-4 py-4 border border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
          </div>

          {/* Subtopic Input */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-4">Add Subtopic (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Computer Networks, DBMS, Algorithms..."
              className="w-full px-4 py-4 border border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
              value={subTopic}
              onChange={e => setSubTopic(e.target.value)}
            />
          </div>

          {/* Number of Questions and Difficulty Selectors (side by side, compact) */}
          <div className="flex flex-row gap-4 items-center justify-center bg-base-200 rounded-lg shadow p-3 my-2">
            <div className="flex flex-col items-center">
              <label htmlFor="numQuestions" className="text-sm font-semibold text-base-content mb-1">No. of Questions</label>
              <select
                id="numQuestions"
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="px-3 py-1 border border-primary rounded-md text-base-content bg-base-100 text-base font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-150 w-20 shadow-sm"
              >
                {[3,4,5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center">
              <label htmlFor="difficulty" className="text-sm font-semibold text-base-content mb-1">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="px-3 py-1 border border-primary rounded-md text-base-content bg-base-100 text-base font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-150 w-24 shadow-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Random Topic Section */}
          {includeResume && (
            <button
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-content py-4 px-6 rounded-xl font-bold text-lg hover:from-primary-focus hover:to-secondary-focus transition-all duration-200 flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleRandomTopic}
              disabled={isGeneratingRandomTopic}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-300 drop-shadow" />
                {isGeneratingRandomTopic
                  ? 'Generating Random Topic...'
                  : 'Generate Random Topic'}
              </span>
              <span className="text-xs text-primary-content/80 font-normal mt-1">based on your resume</span>
            </button>
          )}

          {/* ✅ Start Interview Button */}
          <button
            onClick={handleStartClick}
            className="w-full bg-gradient-to-r from-accent to-primary text-primary-content py-4 px-8 rounded-xl font-semibold text-lg hover:from-accent-focus hover:to-primary-focus transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            disabled={isGeneratingQuestion || isStartingInterview || isGettingLeetCodeAnalysis || isGettingResume}
          >
            {isGettingLeetCodeAnalysis
              ? 'Getting LeetCode Analysis...'
              : isGettingResume
                ? 'Getting Resume...'
                : isGeneratingQuestion
                  ? 'Generating Questions...'
                  : isStartingInterview
                    ? 'Starting Interview...'
                    : 'Start Interview'}
          </button>
        </div>
      </section>
      <UpdateProfileModal open={showResumeModal || showLeetModal} onClose={() => { setShowResumeModal(false); setShowLeetModal(false); }} />
      <GithubProjectModal open={showGithubModal} onClose={() => setShowGithubModal(false)} />
    </div>
  );
};

export default Start;
