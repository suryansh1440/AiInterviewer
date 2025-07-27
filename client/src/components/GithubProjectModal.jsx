import React, { useState } from 'react';
import { X, Plus, Github, Key } from 'lucide-react';
import { useGithubProjectStore } from '../store/useGithubProjectStore';
import toast from 'react-hot-toast';

const GithubProjectModal = ({ open, onClose }) => {
  const { analyzeGithubProject, removeGithubProject, githubProjects, isAnalyzingGithubProject } = useGithubProjectStore();
  const [repo1, setRepo1] = useState('');
  const [repo2, setRepo2] = useState('');
  const [token, setToken] = useState('');

  if (!open) return null;

  const handleAddRepository = async (repoUrl, repoNumber) => {
    if (!repoUrl.trim()) {
      toast.error('Please enter a repository URL');
      return;
    }

    const result = await analyzeGithubProject(repoUrl, token.trim() || null, repoNumber);
    if (result) {
      if (repoNumber === 1) {
        setRepo1('');
      } else {
        setRepo2('');
      }
    }
  };

  const handleRemoveRepository = (repoNumber) => {
    removeGithubProject(repoNumber);
  };

  const getRepositoryByNumber = (repoNumber) => {
    return githubProjects.find(project => project.id === repoNumber);
  };

  const handleClose = () => {
    setRepo1('');
    setRepo2('');
    setToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-base-content">Add GitHub Projects</h2>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
                     {/* Repository 1 */}
           <div className="flex gap-3">
             <div className="flex-1">
               {getRepositoryByNumber(1) ? (
                 <div className="relative">
                   <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success" />
                   <input
                     type="url"
                     value={getRepositoryByNumber(1).url}
                     disabled
                     className="input input-bordered w-full pl-10 bg-success/10 border-success/30 text-success"
                   />
                 </div>
               ) : (
                 <div className="relative">
                   <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                   <input
                     type="url"
                     placeholder="Repository URL 1"
                     value={repo1}
                     onChange={(e) => setRepo1(e.target.value)}
                     autoComplete="off"
                     className="input input-bordered w-full pl-10"
                   />
                 </div>
               )}
             </div>
             {getRepositoryByNumber(1) ? (
               <button
                 onClick={() => handleRemoveRepository(1)}
                 className="btn btn-error"
               >
                 <X className="w-4 h-4" />
               </button>
             ) : (
               <button
                 onClick={() => handleAddRepository(repo1, 1)}
                 disabled={isAnalyzingGithubProject || !repo1.trim()}
                 className="btn btn-primary"
               >
                 {isAnalyzingGithubProject ? (
                   <div className="loading loading-spinner loading-sm"></div>
                 ) : (
                   <Plus className="w-4 h-4" />
                 )}
               </button>
             )}
           </div>

                     {/* Repository 2 */}
           <div className="flex gap-3">
             <div className="flex-1">
               {getRepositoryByNumber(2) ? (
                 <div className="relative">
                   <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success" />
                   <input
                     type="url"
                     value={getRepositoryByNumber(2).url}
                     disabled
                     className="input input-bordered w-full pl-10 bg-success/10 border-success/30 text-success"
                   />
                 </div>
               ) : (
                 <div className="relative">
                   <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                   <input
                     type="url"
                     placeholder="Repository URL 2"
                     value={repo2}
                     onChange={(e) => setRepo2(e.target.value)}
                     autoComplete="off"
                     className="input input-bordered w-full pl-10"
                   />
                 </div>
               )}
             </div>
             {getRepositoryByNumber(2) ? (
               <button
                 onClick={() => handleRemoveRepository(2)}
                 className="btn btn-error"
               >
                 <X className="w-4 h-4" />
               </button>
             ) : (
               <button
                 onClick={() => handleAddRepository(repo2, 2)}
                 disabled={isAnalyzingGithubProject || !repo2.trim()}
                 className="btn btn-primary"
               >
                 {isAnalyzingGithubProject ? (
                   <div className="loading loading-spinner loading-sm"></div>
                 ) : (
                   <Plus className="w-4 h-4" />
                 )}
               </button>
             )}
           </div>

          {/* GitHub Token */}
          <div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="password"
                placeholder="GitHub Token (for private repos)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoComplete="new-password"
                className="input input-bordered w-full pl-10"
              />
            </div>
            <p className="text-xs text-base-content/50 mt-1">
              Only required for private repositories
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <h4 className="font-semibold text-info mb-2">How to get a GitHub Token:</h4>
            <ol className="text-sm text-base-content/70 space-y-1">
              <li>1. Go to GitHub Settings → Developer settings → Personal access tokens</li>
              <li>2. Generate a new token with 'repo' permissions</li>
              <li>3. Copy the token and paste it above for private repositories</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubProjectModal; 