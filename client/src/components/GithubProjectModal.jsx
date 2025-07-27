import React, { useState } from 'react';
import { X, Plus, Github, Key, ExternalLink, Info, CheckCircle, AlertCircle } from 'lucide-react';
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

  const handleGenerateToken = () => {
    window.open('https://github.com/settings/tokens/new?description=AiInterview&scopes=repo', '_blank');
  };

  const getRepoStatus = (repoNumber) => {
    const repo = getRepositoryByNumber(repoNumber);
    if (repo) {
      return { status: 'added', url: repo.url };
    }
    return { status: 'empty' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                 {/* Header */}
         <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-base-content">GitHub Projects</h2>
                <p className="text-sm text-base-content/60">Add your repositories for personalized interviews</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

                 {/* Content */}
         <div className="p-3 space-y-3">
                     {/* Repository Section */}
           <div className="space-y-2">
             <div className="flex items-center gap-2 mb-1">
               <h3 className="text-sm font-semibold text-base-content">Repositories</h3>
               <span className="badge badge-primary badge-sm">{githubProjects.length}/2</span>
             </div>

                         {/* Repository 1 */}
             <div className="bg-base-200/50 rounded-lg p-2 border border-base-300">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {getRepositoryByNumber(1) ? (
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Repository Added</span>
                      </div>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success" />
                        <input
                          type="url"
                          value={getRepositoryByNumber(1).url}
                          disabled
                          className="input input-bordered w-full pl-10 bg-success/10 border-success/30 text-success font-mono text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-base-content/30 rounded-full"></div>
                        <span className="text-sm text-base-content/60">Repository 1</span>
                      </div>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                        <input
                          type="url"
                          placeholder="https://github.com/username/repository"
                          value={repo1}
                          onChange={(e) => setRepo1(e.target.value)}
                          autoComplete="off"
                          className="input input-bordered w-full pl-10 focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {getRepositoryByNumber(1) ? (
                  <button
                    onClick={() => handleRemoveRepository(1)}
                    className="btn btn-error btn-sm"
                    title="Remove repository"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddRepository(repo1, 1)}
                    disabled={isAnalyzingGithubProject || !repo1.trim()}
                    className="btn btn-primary btn-sm"
                    title="Add repository"
                  >
                    {isAnalyzingGithubProject ? (
                      <div className="loading loading-spinner loading-sm"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

                         {/* Repository 2 */}
             <div className="bg-base-200/50 rounded-lg p-2 border border-base-300">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {getRepositoryByNumber(2) ? (
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">Repository Added</span>
                      </div>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success" />
                        <input
                          type="url"
                          value={getRepositoryByNumber(2).url}
                          disabled
                          className="input input-bordered w-full pl-10 bg-success/10 border-success/30 text-success font-mono text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-base-content/30 rounded-full"></div>
                        <span className="text-sm text-base-content/60">Repository 2</span>
                      </div>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                        <input
                          type="url"
                          placeholder="https://github.com/username/repository"
                          value={repo2}
                          onChange={(e) => setRepo2(e.target.value)}
                          autoComplete="off"
                          className="input input-bordered w-full pl-10 focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {getRepositoryByNumber(2) ? (
                  <button
                    onClick={() => handleRemoveRepository(2)}
                    className="btn btn-error btn-sm"
                    title="Remove repository"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddRepository(repo2, 2)}
                    disabled={isAnalyzingGithubProject || !repo2.trim()}
                    className="btn btn-primary btn-sm"
                    title="Add repository"
                  >
                    {isAnalyzingGithubProject ? (
                      <div className="loading loading-spinner loading-sm"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

                     {/* GitHub Token Section */}
           <div className="bg-warning/5 border border-warning/20 rounded-lg p-2">
             <div className="flex items-center gap-2 mb-1">
               <Key className="w-4 h-4 text-warning" />
               <h3 className="text-sm font-semibold text-base-content">GitHub Token</h3>
             </div>
             
             <div className="space-y-1">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your GitHub token (optional)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="new-password"
                  className="input input-bordered w-full focus:border-warning"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateToken}
                  className="btn btn-warning btn-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Generate Token
                </button>
                <span className="text-xs text-base-content/60">
                  Only needed for private repositories
                </span>
              </div>
            </div>
          </div>

          

                     {/* Footer */}
           <div className="flex items-center justify-between pt-2 border-t border-base-300">
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <AlertCircle className="w-4 h-4" />
              <span>Maximum 2 repositories allowed</span>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubProjectModal; 