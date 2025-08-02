from flask import Flask, request, jsonify
import os
import requests
import json

app = Flask(__name__)

# Simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'gitingest-backend'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'GitIngest Backend is running!'})

# Simplified ingest endpoint with fallback
@app.route('/ingest-repo', methods=['POST'])
def ingest_repository():
    try:
        data = request.get_json()
        repo_url = data.get('repo_url')
        github_token = data.get('github_token')

        if not repo_url:
            return jsonify({'error': 'repo_url is required'}), 400

        # For now, return a mock response to test if the endpoint works
        # You can add the actual gitingest logic later
        return jsonify({
            'summary': f'Mock summary for {repo_url}',
            'tree': {'type': 'mock', 'url': repo_url},
            'content': 'Mock content - gitingest package needs to be configured for Vercel'
        })
        
    except Exception as e:
        return jsonify({'error': f'Serverless function error: {str(e)}'}), 500

# Simplified PDF extraction endpoint
@app.route('/extract-pdf-text', methods=['POST'])
def extract_pdf_text():
    try:
        data = request.get_json()
        pdf_url = data.get('pdf_url')
        
        if not pdf_url:
            return jsonify({'error': 'pdf_url is required'}), 400

        # For now, return a mock response
        return jsonify({
            'text': f'Mock PDF text extraction for {pdf_url} - pdfminer.six needs to be configured for Vercel'
        })
        
    except Exception as e:
        return jsonify({'error': f'Serverless function error: {str(e)}'}), 500

# Test endpoint to check if the function is working
@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        'message': 'Function is working!',
        'environment': os.environ.get('NODE_ENV', 'unknown'),
        'python_version': os.sys.version
    })

# For local development
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)