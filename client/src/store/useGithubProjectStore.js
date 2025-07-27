import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useGithubProjectStore = create((set, get) => ({
    githubProjects: [],
    githubToken: null,
    isAnalyzingGithubProject: false,


    analyzeGithubProject: async (repoUrl, githubToken = null,repoNumber) => {
        set({ isAnalyzingGithubProject: true });

        // Basic validation
        if (!repoUrl) {
            toast.error('Please enter a GitHub repository URL');
            return null;
        }

        // Check if maximum repositories reached
        const currentState = get();
        if (currentState.githubProjects.length >= 2) {
            toast.error('Maximum 2 repositories allowed');
            set({ isAnalyzingGithubProject: false });
            return null;
        }

        // Simple GitHub URL validation
        const githubUrlPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;
        if (!githubUrlPattern.test(repoUrl)) {
            toast.error('Please enter a valid GitHub repository URL');
            return null;
        }

        try {
            const response = await axiosInstance.post('/ai/analyzeGitHubRepo', { repoUrl, githubToken });
            
            // Add the new project to the list
            const newProject = {
                id: repoNumber,
                url: repoUrl,
                analysis: response.data.analysis,
                tree: response.data.tree,

            };
            
            set((state) => {
                const updatedProjects = [...state.githubProjects, newProject];
                return { githubProjects: updatedProjects };
            });

            toast.success('Repository analyzed and added successfully!');
            return response.data;
        } catch (error) {
            console.error('Error analyzing repository:', error);
            toast.error('Failed to analyze repository. Please add token if repo is private');
            return null;
        } finally {
            set({ isAnalyzingGithubProject: false });
        }
    },

    removeGithubProject: (repoNumber) => {
        set((state) => {
            const updatedProjects = state.githubProjects.filter(project => project.id !== repoNumber);
            return { githubProjects: updatedProjects };
        });

        toast.success('Repository removed successfully!');
    },

    clearGithubProjects: () => {
        set({ githubProjects: []});
    }
}))