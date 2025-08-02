from flask import Flask, request, jsonify
from gitingest import ingest
import os
import requests
from io import BytesIO
from pdfminer.high_level import extract_text

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

# New endpoint for PDF text extraction
@app.route('/extract-pdf-text', methods=['POST'])
def extract_pdf_text():
    data = request.get_json()
    pdf_url = data.get('pdf_url')
    if not pdf_url:
        return jsonify({'error': 'pdf_url is required'}), 400
    try:
        # Download the PDF
        response = requests.get(pdf_url)
        response.raise_for_status()
        pdf_bytes = BytesIO(response.content)
        # Extract text
        text = extract_text(pdf_bytes)
        return jsonify({'text': text})
    except Exception as e:
        import traceback
        print(f"Error extracting PDF text: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'gitingest-backend'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'GitIngest Backend is running!'})

# For local development
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)