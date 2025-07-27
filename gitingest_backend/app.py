from flask import Flask, request, jsonify
from gitingest import ingest
import os

app = Flask(__name__)

@app.route('/ingest-repo', methods=['POST'])
def ingest_repository():
    data = request.get_json()
    repo_url = data.get('repo_url')
    # github_token = data.get('github_token', os.environ.get('GITHUB_TOKEN'))

    if not repo_url:
        return jsonify({'error': 'repo_url is required'}), 400

    print(f"Attempting to ingest repo: {repo_url}")
    # print(f"Using GitHub token (first 5 chars): {github_token[:5] if github_token else 'None'}...")

    try:
        summary, tree, content = ingest(repo_url
                                        # , token=github_token if github_token else 'ghp_xxxxxxxxxxxxxxxxxxxx'
                                        )
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