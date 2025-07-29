import axios from 'axios';

export const analyze = async (repoUrl, githubToken) => {
    try {
      const response = await axios.post(`${process.env.PYTHON_BACKEND_URL}/ingest-repo`, {
        repo_url: repoUrl,
        github_token: githubToken
      });

      const { summary, tree, content } = response.data;
      
      return {
        summary,
        tree,
        files: content
      };
    } catch (error) {
      console.error('Error calling Gitingest service:', error.message);
      throw new Error(`Failed to analyze repository: ${error.message}`);
    }
}