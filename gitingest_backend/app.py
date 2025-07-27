from flask import Flask, request, jsonify
from gitingest import ingest
import os

app = Flask(__name__)

@app.route('/ingest-repo', methods=['POST'])
def ingest_repository():
    data = request.get_json()
    repo_url = data.get('repo_url')
    github_token = data.get('github_token')  # Optional token parameter

    if not repo_url:
        return jsonify({'error': 'repo_url is required'}), 400

    print(f"Attempting to ingest repo: {repo_url}")
    if github_token:
        print(f"Using provided GitHub token (first 5 chars): {github_token[:5]}...")
    else:
        print("No GitHub token provided, using public access")

    try:
        # Call ingest with token if provided, otherwise without token
        if github_token:
            summary, tree, content = ingest(repo_url, token=github_token)
        else:
            summary, tree, content = ingest(repo_url)
            
        return jsonify({
            'summary': summary,
            'tree': tree,
            'content': content
        })
    except Exception as e:
        import traceback
        print(f"Error during gitingest: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)