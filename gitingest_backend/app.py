from flask import Flask, request, jsonify
import os
import requests
import json
import base64
from urllib.parse import urlparse
from io import BytesIO
from pypdf import PdfReader

app = Flask(__name__)

# Simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'gitingest-backend'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'GitIngest Backend is running!'})

def parse_github_url(repo_url):
    """Parse GitHub URL to extract owner and repo name"""
    try:
        # Handle different GitHub URL formats
        if 'github.com' in repo_url:
            path = urlparse(repo_url).path.strip('/')
            parts = path.split('/')
            if len(parts) >= 2:
                return parts[0], parts[1]
    except:
        pass
    return None, None

def get_repo_content(owner, repo, path='', token=None):
    """Get repository content using GitHub API"""
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'
    
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{path}'
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    return None

def get_file_content(owner, repo, path, token=None):
    """Get specific file content from repository"""
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'token {token}'
    
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{path}'
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        if 'content' in data:
            try:
                # Decode the base64 content to get the actual file content
                content = base64.b64decode(data['content']).decode('utf-8')
                return content
            except UnicodeDecodeError:
                # Skip binary files that can't be decoded as UTF-8
                print(f"Skipping binary file: {path}")
                return None
            except Exception as e:
                print(f"Error decoding content for {path}: {e}")
                return None
    return None

def is_text_file(filename):
    """Check if a file is likely to be a text file based on extension"""
    text_extensions = {
        # Code files
        '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt',
        '.html', '.css', '.scss', '.sass', '.less', '.xml', '.json', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
        '.md', '.txt', '.rst', '.tex', '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
        '.sql', '.r', '.m', '.pl', '.lua', '.scala', '.clj', '.hs', '.ml', '.fs', '.vbs',
        '.vue', '.svelte', '.jsx', '.tsx', '.js', '.ts', '.jsx', '.tsx',
        # Config files
        '.env', '.gitignore', '.gitattributes', '.editorconfig', '.eslintrc', '.prettierrc',
        '.babelrc', '.webpack.config.js', '.rollup.config.js', '.vite.config.js',
        '.package.json', '.package-lock.json', '.yarn.lock', '.pnpm-lock.yaml',
        '.dockerfile', '.docker-compose.yml', '.docker-compose.yaml',
        '.travis.yml', '.github/workflows/', '.gitlab-ci.yml', '.circleci/config.yml',
        '.readme', '.license', '.changelog', '.contributing', '.authors', '.credits'
    }
    
    # Check file extension
    ext = '.' + filename.lower().split('.')[-1] if '.' in filename else ''
    if ext in text_extensions:
        return True
    
    # Check for common text file patterns
    text_patterns = ['readme', 'license', 'changelog', 'contributing', 'authors', 'credits']
    filename_lower = filename.lower()
    for pattern in text_patterns:
        if pattern in filename_lower:
            return True
    
    return False

def recursively_analyze_repo(owner, repo, path='', token=None, max_files=200):
    """Recursively analyze repository structure and content"""
    try:
        print(f"Analyzing path: '{path}' for {owner}/{repo}")
        contents = get_repo_content(owner, repo, path, token)
        if not contents:
            print(f"No contents found for path: '{path}'")
            return [], 0, 0
        
        print(f"Found {len(contents)} items in path: '{path}'")
        
        files = []
        directories = []
        total_size = 0
        file_count = 0
        
        for item in contents:
            if item['type'] == 'file':
                # Skip binary files
                if not is_text_file(item['name']):
                    print(f"Skipping binary file: {item['path']}")
                    continue
                
                print(f"Processing text file: {item['path']}")
                # Get the ACTUAL file content (all the code)
                content = get_file_content(owner, repo, item['path'], token)
                
                # Only add files that have content
                if content:
                    file_info = {
                        'name': item['name'],
                        'path': item['path'],
                        'size': item['size'],
                        'type': 'file',
                        'content': content,  # This contains ALL the code
                        'sha': item['sha'],
                        'url': item['url']
                    }
                    files.append(file_info)
                    total_size += item['size']
                    file_count += 1
                    
                    print(f"Added text file: {item['name']} (size: {item['size']}, content length: {len(content)})")
                else:
                    print(f"Skipped file with no content: {item['name']}")
                
                # Increased limit to get more files
                if file_count >= max_files:
                    print(f"Reached max files limit: {max_files}")
                    break
                    
            elif item['type'] == 'dir':
                print(f"Found directory: {item['path']}")
                directories.append({
                    'name': item['name'],
                    'path': item['path'],
                    'type': 'directory',
                    'sha': item['sha'],
                    'url': item['url']
                })
                
                # Recursively analyze subdirectories to get ALL code
                if file_count < max_files:
                    print(f"Recursively analyzing subdirectory: {item['path']}")
                    sub_files, sub_size, sub_count = recursively_analyze_repo(
                        owner, repo, item['path'], token, max_files - file_count
                    )
                    files.extend(sub_files)
                    total_size += sub_size
                    file_count += sub_count
                    print(f"Subdirectory analysis complete: {sub_count} files added")
        
        print(f"Path '{path}' analysis complete - Files: {file_count}, Size: {total_size}")
        return files, total_size, file_count
        
    except Exception as e:
        print(f"Error analyzing repo at path {path}: {e}")
        import traceback
        traceback.print_exc()
        return [], 0, 0

def analyze_repo_structure(owner, repo, token=None):
    """Analyze complete repository structure and content"""
    try:
        print(f"Starting analyze_repo_structure for {owner}/{repo}")
        
        # Get repository info
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if token:
            headers['Authorization'] = f'token {token}'
        
        repo_url = f'https://api.github.com/repos/{owner}/{repo}'
        repo_response = requests.get(repo_url, headers=headers)
        
        repo_info = {}
        if repo_response.status_code == 200:
            repo_data = repo_response.json()
            repo_info = {
                'name': repo_data['name'],
                'full_name': repo_data['full_name'],
                'description': repo_data['description'],
                'language': repo_data['language'],
                'stars': repo_data['stargazers_count'],
                'forks': repo_data['forks_count'],
                'created_at': repo_data['created_at'],
                'updated_at': repo_data['updated_at']
            }
            print(f"Repository info: {repo_info}")
        else:
            print(f"Failed to get repo info: {repo_response.status_code}")
        
        # Recursively get all files and content
        print("Starting recursive file analysis...")
        all_files, total_size, file_count = recursively_analyze_repo(owner, repo, '', token)
        print(f"Recursive analysis complete - Files: {file_count}, Size: {total_size}")
        
        if file_count == 0:
            print("No files found - checking if repository is empty or inaccessible")
            # Try to get root contents directly
            root_contents = get_repo_content(owner, repo, '', token)
            if root_contents:
                print(f"Root contents found: {len(root_contents)} items")
                for item in root_contents:
                    print(f"  - {item['name']} ({item['type']})")
            else:
                print("No root contents found")
        
        # Categorize files by type
        code_files = []
        config_files = []
        doc_files = []
        other_files = []
        
        for file in all_files:
            if file['type'] == 'file':
                ext = file['name'].lower().split('.')[-1] if '.' in file['name'] else ''
                
                if ext in ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt']:
                    code_files.append(file)
                elif ext in ['json', 'yaml', 'yml', 'xml', 'toml', 'ini', 'cfg', 'conf']:
                    config_files.append(file)
                elif ext in ['md', 'txt', 'pdf', 'doc', 'docx']:
                    doc_files.append(file)
                else:
                    other_files.append(file)
        
        print(f"File categorization - Code: {len(code_files)}, Config: {len(config_files)}, Docs: {len(doc_files)}, Other: {len(other_files)}")
        
        summary = {
            'total_files': file_count,
            'total_size': total_size,
            'code_files': len(code_files),
            'config_files': len(config_files),
            'doc_files': len(doc_files),
            'other_files': len(other_files),
            'repository_info': repo_info
        }
        
        tree = {
            'all_files': all_files,
            'code_files': code_files,
            'config_files': config_files,
            'doc_files': doc_files,
            'other_files': other_files,
            'owner': owner,
            'repo': repo
        }
        
        content = {
            'files_with_content': all_files,
            'file_count': file_count,
            'total_size': total_size,
            'repository_info': repo_info
        }
        
        print(f"Analysis complete - Summary: {summary}")
        return summary, tree, content
        
    except Exception as e:
        print(f"Error in analyze_repo_structure: {e}")
        import traceback
        traceback.print_exc()
        return None, None, None

# Enhanced ingest endpoint with full repository content
@app.route('/ingest-repo', methods=['POST'])
def ingest_repository():
    try:
        data = request.get_json()
        repo_url = data.get('repo_url')
        github_token = data.get('github_token')

        print(f"Received request for repo: {repo_url}")
        print(f"GitHub token provided: {'Yes' if github_token else 'No'}")

        if not repo_url:
            return jsonify({'error': 'repo_url is required'}), 400

        # Parse GitHub URL
        owner, repo = parse_github_url(repo_url)
        print(f"Parsed URL - Owner: {owner}, Repo: {repo}")
        
        if not owner or not repo:
            return jsonify({'error': 'Invalid GitHub URL'}), 400

        # Test GitHub API access first
        headers = {'Accept': 'application/vnd.github.v3+json'}
        if github_token:
            headers['Authorization'] = f'token {github_token}'
        
        # Test repository access
        test_url = f'https://api.github.com/repos/{owner}/{repo}'
        print(f"Testing repository access: {test_url}")
        
        test_response = requests.get(test_url, headers=headers)
        print(f"Repository test response status: {test_response.status_code}")
        
        if test_response.status_code == 404:
            return jsonify({'error': 'Repository not found or not accessible'}), 404
        elif test_response.status_code == 401:
            return jsonify({'error': 'Unauthorized - check GitHub token'}), 401
        elif test_response.status_code == 403:
            # Check if it's rate limiting or private repo
            rate_limit_remaining = test_response.headers.get('X-RateLimit-Remaining', 'unknown')
            rate_limit_reset = test_response.headers.get('X-RateLimit-Reset', 'unknown')
            
            error_message = "Access forbidden. This could be due to:"
            if rate_limit_remaining == '0':
                error_message += f"\n- Rate limit exceeded. Reset time: {rate_limit_reset}"
            else:
                error_message += "\n- Repository is private and requires authentication"
                error_message += "\n- Rate limit approaching (unauthenticated requests limited to 60/hour)"
            
            error_message += "\n\nSolutions:"
            error_message += "\n1. Add a GitHub token to increase rate limits"
            error_message += "\n2. Wait for rate limit to reset"
            error_message += "\n3. Make repository public if it's private"
            
            return jsonify({
                'error': error_message,
                'rate_limit_remaining': rate_limit_remaining,
                'rate_limit_reset': rate_limit_reset,
                'suggestion': 'Add github_token parameter to your request'
            }), 403
        elif test_response.status_code != 200:
            return jsonify({'error': f'GitHub API error: {test_response.status_code}'}), 500

        # Test contents access
        contents_url = f'https://api.github.com/repos/{owner}/{repo}/contents'
        print(f"Testing contents access: {contents_url}")
        
        contents_response = requests.get(contents_url, headers=headers)
        print(f"Contents test response status: {contents_response.status_code}")
        
        if contents_response.status_code != 200:
            print(f"Contents response: {contents_response.text}")
            return jsonify({'error': f'Cannot access repository contents: {contents_response.status_code}'}), 500

        contents_data = contents_response.json()
        print(f"Found {len(contents_data)} items in root directory")

        # Analyze complete repository
        print("Starting repository analysis...")
        summary, tree, content = analyze_repo_structure(owner, repo, github_token)
        
        print(f"Analysis complete - Summary: {summary}, Tree files: {len(tree.get('all_files', []))}, Content files: {len(content.get('files_with_content', []))}")
        
        if summary is None:
            return jsonify({'error': 'Failed to analyze repository'}), 500

        return jsonify({
            'summary': summary,
            'tree': tree,
            'content': content
        })
        
    except Exception as e:
        print(f"Exception in ingest_repository: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Serverless function error: {str(e)}'}), 500

# Enhanced PDF extraction endpoint
@app.route('/extract-pdf-text', methods=['POST'])
def extract_pdf_text():
    try:
        data = request.get_json()
        pdf_url = data.get('pdf_url')
        
        if not pdf_url:
            return jsonify({'error': 'pdf_url is required'}), 400

        # Download PDF content
        print(f"Downloading PDF from: {pdf_url}")
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        # Check if content is actually a PDF
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' not in content_type and not pdf_url.lower().endswith('.pdf'):
            print(f"Warning: Content type is {content_type}, but attempting to extract anyway")
        
        # Extract text from PDF
        try:
            pdf_file = BytesIO(response.content)
            pdf_reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            extracted_text = ""
            total_pages = len(pdf_reader.pages)
            print(f"PDF has {total_pages} pages")
            
            for page_num, page in enumerate(pdf_reader.pages, 1):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text += page_text + "\n"
                    print(f"Extracted text from page {page_num}/{total_pages} (length: {len(page_text)})")
                except Exception as page_error:
                    print(f"Error extracting text from page {page_num}: {page_error}")
                    continue
            
            # Clean up the extracted text
            extracted_text = extracted_text.strip()
            
            if not extracted_text:
                return jsonify({
                    'text': '',
                    'metadata': {
                        'url': pdf_url,
                        'content_length': len(response.content),
                        'content_type': content_type,
                        'total_pages': total_pages,
                        'note': 'PDF extracted but no text content found. The PDF may be image-based or encrypted.'
                    },
                    'warning': 'No text could be extracted from the PDF'
                })
            
            print(f"Successfully extracted {len(extracted_text)} characters from PDF")
            
            return jsonify({
                'text': extracted_text,
                'metadata': {
                    'url': pdf_url,
                    'content_length': len(response.content),
                    'content_type': content_type,
                    'total_pages': total_pages,
                    'extracted_text_length': len(extracted_text)
                }
            })
            
        except Exception as pdf_error:
            print(f"Error extracting PDF text: {pdf_error}")
            import traceback
            traceback.print_exc()
            
            # Return error with metadata
            return jsonify({
                'text': '',
                'metadata': {
                    'url': pdf_url,
                    'content_length': len(response.content),
                    'content_type': content_type,
                    'error': str(pdf_error)
                },
                'error': f'Failed to extract text from PDF: {str(pdf_error)}'
            }), 500
        
    except requests.exceptions.RequestException as e:
        print(f"Error downloading PDF: {e}")
        return jsonify({'error': f'Failed to download PDF: {str(e)}'}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Serverless function error: {str(e)}'}), 500

# For local development
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)