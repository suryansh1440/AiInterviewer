# CI/CD Pipeline Detailed Documentation

## 📋 Overview

This CI/CD pipeline automates the build, test, and deployment of the AiInterview application using Jenkins, Ansible, and Docker.

---

## 🏗️ Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│  (Source Code)  │
└────────┬────────┘
         │
         │ (Trigger)
         ▼
┌─────────────────┐
│  Jenkins Server │
│  (CI/CD Engine) │
└────────┬────────┘
         │
         │ (SSH via Ansible)
         ▼
┌─────────────────┐
│ Deployment     │
│ Server (EC2)   │
│ 23.20.67.153   │
└─────────────────┘
```

---

## 🔄 Pipeline Flow - Step by Step

### **WHERE:** Jenkins Server
### **WHEN:** Triggered by:
- Manual build (Build Now)
- Git push to main branch (if webhook configured)
- Scheduled build (if configured)
- Polling SCM (if configured)

---

## 📍 Stage 1: Checkout
**WHERE:** Jenkins Server  
**WHEN:** First stage, runs immediately  
**WHAT IT DOES:**
- Clones/pulls code from GitHub repository
- Repository: `https://github.com/suryansh1440/AiInterviewer.git`
- Branch: `main`
- Code is checked out to Jenkins workspace

**COMMANDS:**
```bash
git clone https://github.com/suryansh1440/AiInterviewer.git
# or git pull if already exists
```

---

## 📍 Stage 2: Validate
**WHERE:** Jenkins Server  
**WHEN:** After checkout  
**WHAT IT DOES:**
- Validates that required files exist:
  - `docker-compose.yml` - Docker orchestration file
  - `ansible/deploy.yml` - Ansible deployment playbook
  - `ansible/inventory.ini` - Server inventory
- Fails pipeline if any file is missing
- Prevents deployment of incomplete code

**COMMANDS:**
```bash
test -f docker-compose.yml
test -f ansible/deploy.yml
test -f ansible/inventory.ini
```

---

## 📍 Stage 3: Install Dependencies
**WHERE:** Jenkins Server  
**WHEN:** After validation  
**WHAT IT DOES:**
- Installs Node.js dependencies for both frontend and backend
- Runs in **parallel** for faster execution

### 3a. Backend Dependencies
- Location: `backend/` directory
- Command: `npm ci --production=false`
- Installs all packages from `package.json`
- Used for linting and testing

### 3b. Frontend Dependencies
- Location: `client/` directory
- Command: `npm ci --production=false`
- Installs all packages from `package.json`
- Used for linting and testing

**PURPOSE:** Ensures code can be analyzed and tested before deployment

---

## 📍 Stage 4: Lint & Test
**WHERE:** Jenkins Server  
**WHEN:** After dependencies installed  
**WHAT IT DOES:**
- Runs code quality checks (linting)
- Runs in **parallel** for faster execution
- Non-blocking (warnings don't stop pipeline)

### 4a. Backend Lint
- Checks JavaScript code quality
- Command: `npm run lint` (if script exists)
- Catches syntax errors and style issues

### 4b. Frontend Lint
- Checks React/JavaScript code quality
- Command: `npm run lint` (if script exists)
- Catches syntax errors and style issues

**PURPOSE:** Catch code quality issues early before deployment

---

## 📍 Stage 5: Build Docker Images
**WHERE:** Jenkins Server  
**WHEN:** After linting  
**WHAT IT DOES:**
- Builds all Docker images locally on Jenkins server
- Validates that Dockerfiles are correct
- Builds:
  - `frontend` (React app → Nginx)
  - `node_backend` (Node.js API)
  - `python_backend` (Flask API)
- Uses `--no-cache` for clean builds

**COMMANDS:**
```bash
docker compose build --no-cache
```

**PURPOSE:** 
- Catch Docker build errors before deployment
- Validate Docker configuration
- Ensure images can be built successfully

**IMAGES BUILT:**
1. **Frontend:** Multi-stage build (Node.js → Nginx)
   - Builds React app with Vite
   - Copies built files to Nginx
2. **Node Backend:** Node.js 18 image
   - Installs dependencies
   - Copies application code
3. **Python Backend:** Python 3.11 image
   - Installs Python packages
   - Copies Flask application

---

## 📍 Stage 6: Check Ansible
**WHERE:** Jenkins Server  
**WHEN:** After Docker build  
**WHAT IT DOES:**
- Checks if Ansible is installed on Jenkins server
- Installs Ansible if not present: `pip3 install ansible`
- Verifies Ansible version
- Required for deployment stage

**COMMANDS:**
```bash
ansible-playbook --version
# or
pip3 install ansible
```

**PURPOSE:** Ensure deployment tool is available

---

## 📍 Stage 7: Deploy with Ansible
**WHERE:** 
- **FROM:** Jenkins Server
- **TO:** Deployment Server (23.20.67.153)

**WHEN:** After Ansible check  
**WHAT IT DOES:**
- Connects to deployment server via SSH
- Uses Ansible to automate deployment
- Executes `ansible/deploy.yml` playbook

### Detailed Deployment Steps (on Deployment Server):

#### Step 7.1: Ensure Directory Exists
- **Location:** `/opt/app` on deployment server
- **Action:** Creates directory if doesn't exist
- **Owner:** ubuntu user
- **Permissions:** 755

#### Step 7.2: Pull Latest Code
- **Location:** `/opt/app` on deployment server
- **Action:** Git pull from GitHub
- **Repository:** `https://github.com/suryansh1440/AiInterviewer.git`
- **Branch:** `main`
- **Force:** Yes (overwrites local changes)

#### Step 7.3: Stop Old Containers
- **Location:** `/opt/app` on deployment server
- **Action:** Stops and removes existing containers
- **Command:** `docker compose down`
- **User:** ubuntu (via become_user)
- **Purpose:** Clean shutdown before new deployment

#### Step 7.4: Build and Start Containers
- **Location:** `/opt/app` on deployment server
- **Action:** Builds new images and starts containers
- **Command:** `docker compose up -d --build`
- **User:** ubuntu
- **Environment Variables:**
  - `DOCKER_BUILDKIT=1` (faster builds)
  - `COMPOSE_DOCKER_CLI_BUILD=1` (uses Docker CLI)

**CONTAINERS STARTED:**
1. **react_frontend** (Port 80)
   - Serves React application via Nginx
2. **node_backend** (Port 5000)
   - Node.js API server
   - Connects to MongoDB
   - Uses `.env` file from `./backend/.env`
3. **python_backend** (Port 8000)
   - Flask API for PDF extraction and GitHub analysis
4. **mongo_db** (Port 27017 - internal only)
   - MongoDB database
   - Data persisted in volume `mongo_data`

**NETWORK:**
- All containers on `my_network` bridge network
- Can communicate using service names (e.g., `mongo`, `node_backend`)

**COMMANDS EXECUTED:**
```bash
# On deployment server via SSH
cd /opt/app
docker compose down
docker compose up -d --build
```

---

## 📍 Stage 8: Verify Deployment
**WHERE:** 
- **FROM:** Jenkins Server
- **TO:** Deployment Server (23.20.67.153)

**WHEN:** After deployment  
**WHAT IT DOES:**
- Waits 20 seconds for containers to start
- Connects to deployment server via SSH
- Checks container status using Ansible
- Verifies all containers are running

**COMMANDS:**
```bash
sleep 20
ansible app -i ansible/inventory.ini --become -m shell \
  -a "cd /opt/app && docker compose ps" -u ubuntu
```

**PURPOSE:** Confirm deployment was successful

---

## 📧 Post-Build Actions

### Always (Cleanup)
**WHERE:** Jenkins Server  
**WHEN:** After all stages (success or failure)  
**WHAT IT DOES:**
- Cleans up Docker images on Jenkins server
- Frees disk space
- Command: `docker system prune -f`

### Success
**WHERE:** Jenkins Server  
**WHEN:** If all stages succeed  
**WHAT IT DOES:**
- Sends success email to `suryansh1440@gmail.com`
- Includes build details and URL
- HTML formatted email

### Failure
**WHERE:** Jenkins Server  
**WHEN:** If any stage fails  
**WHAT IT DOES:**
- Sends failure email to `suryansh1440@gmail.com`
- Includes build logs as attachment
- HTML formatted email

### Unstable
**WHERE:** Jenkins Server  
**WHEN:** If pipeline completes with warnings  
**WHAT IT DOES:**
- Sends unstable email to `suryansh1440@gmail.com`
- Notifies about warnings or test failures

---

## 🗺️ Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    JENKINS SERVER                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Checkout Code from GitHub                               │
│     ↓                                                        │
│  2. Validate Files Exist                                    │
│     ↓                                                        │
│  3. Install Dependencies (Backend + Frontend in parallel)   │
│     ↓                                                        │
│  4. Lint Code (Backend + Frontend in parallel)              │
│     ↓                                                        │
│  5. Build Docker Images Locally                             │
│     ↓                                                        │
│  6. Check/Install Ansible                                   │
│     ↓                                                        │
│  7. Deploy via Ansible ───────────────────────┐            │
│     │                                           │            │
│     │ (SSH Connection)                          │            │
│     │                                           │            │
│     └───────────────────────────────────────────┼────────────┘
│                                                  │
│  8. Verify Deployment ──────────────────────────┼──────────┐
│     │                                             │          │
│     │ (SSH Connection)                            │          │
│     │                                             │          │
│     └─────────────────────────────────────────────┼──────────┼──┐
│                                                    │          │  │
└────────────────────────────────────────────────────┼──────────┼──┘
                                                     │          │
                                                     ▼          │
┌─────────────────────────────────────────────────────────────┐│
│              DEPLOYMENT SERVER (23.20.67.153)               ││
├─────────────────────────────────────────────────────────────┤│
│                                                              ││
│  Step 7.1: Create /opt/app directory                        ││
│     ↓                                                        ││
│  Step 7.2: Git pull latest code                            ││
│     ↓                                                        ││
│  Step 7.3: Stop old containers                              ││
│     ↓                                                        ││
│  Step 7.4: Build & start new containers                     ││
│     │                                                        ││
│     ├─→ react_frontend (Port 80)                            ││
│     ├─→ node_backend (Port 5000)                            ││
│     ├─→ python_backend (Port 8000)                          ││
│     └─→ mongo_db (Port 27017 - internal)                    ││
│                                                              ││
│  Step 8: Verify containers are running                      ││
│     ↓                                                        ││
│  ✅ Application Live!                                        ││
│                                                              ││
└─────────────────────────────────────────────────────────────┘│
                                                               │
                                                               │
┌──────────────────────────────────────────────────────────────┘
│                    EMAIL NOTIFICATION
├───────────────────────────────────────────────────────────────
│
│  Success/Failure/Unstable email sent to:
│  suryansh1440@gmail.com
│
└───────────────────────────────────────────────────────────────
```

---

## ⏰ When Pipeline Runs

### 1. Manual Trigger
- **When:** User clicks "Build Now" in Jenkins
- **Use Case:** Immediate deployment, testing

### 2. Git Webhook (Recommended)
- **When:** Code is pushed to `main` branch
- **Setup:** Configure GitHub webhook pointing to Jenkins
- **Use Case:** Automatic deployment on every push

### 3. Scheduled Build
- **When:** Based on cron schedule (e.g., daily at 2 AM)
- **Use Case:** Regular deployments, scheduled updates

### 4. Poll SCM
- **When:** Jenkins checks repository periodically
- **Schedule:** `H/15 * * * *` (every 15 minutes)
- **Use Case:** Automatic detection of new commits

---

## 📍 Where Each Component Runs

| Component | Location | Purpose |
|-----------|---------|---------|
| **Jenkins Server** | Your Jenkins instance | CI/CD orchestration, builds, tests |
| **GitHub Repository** | github.com | Source code storage |
| **Deployment Server** | 23.20.67.153 (EC2) | Production application hosting |
| **Frontend Container** | Deployment Server (Port 80) | React application (Nginx) |
| **Backend Container** | Deployment Server (Port 5000) | Node.js API server |
| **Python Backend** | Deployment Server (Port 8000) | Flask API (PDF/GitHub) |
| **MongoDB Container** | Deployment Server (Port 27017) | Database (internal only) |

---

## 🔐 Security & Authentication

### SSH Authentication
- **Method:** SSH Agent Plugin
- **Credential ID:** `app-ec2-ssh-key`
- **User:** `ubuntu`
- **Purpose:** Secure connection to deployment server

### Environment Variables
- **Backend:** Loaded from `/opt/app/backend/.env` on deployment server
- **Frontend:** Embedded at build time from `client/.env`
- **Not stored in Git:** `.env` files are in `.gitignore`

---

## 📊 Pipeline Timeline

```
Time    Stage                    Duration    Location
─────────────────────────────────────────────────────
0:00    Checkout                 10-30s     Jenkins
0:30    Validate                 1-2s       Jenkins
0:32    Install Dependencies    30-60s     Jenkins (parallel)
1:32    Lint & Test              10-30s     Jenkins (parallel)
2:02    Build Docker Images      2-5 min    Jenkins
7:02    Check Ansible            1-2s       Jenkins
7:04    Deploy with Ansible      1-3 min    Jenkins → EC2
10:04   Verify Deployment        20-30s     Jenkins → EC2
10:34   Email Notification        Instant    Jenkins
─────────────────────────────────────────────────────
Total: ~10-11 minutes
```

---

## 🎯 What Gets Deployed

### Services Deployed:
1. **Frontend (React)**
   - Built with Vite
   - Served via Nginx
   - Accessible on Port 80
   - Environment variables embedded at build time

2. **Backend (Node.js)**
   - Express.js API server
   - Socket.io for real-time communication
   - OpenAI integration
   - Accessible on Port 5000
   - Uses MongoDB for data storage

3. **Python Backend (Flask)**
   - PDF text extraction
   - GitHub repository analysis
   - Accessible on Port 8000

4. **MongoDB**
   - Database server
   - Data persisted in Docker volume
   - Internal access only (not exposed publicly)

---

## 🔄 Rollback Strategy

If deployment fails:
1. Old containers are stopped but not removed
2. New containers fail to start
3. Email notification sent
4. Manual intervention required

**To rollback manually:**
```bash
# SSH to deployment server
ssh ubuntu@23.20.67.153

# Go to app directory
cd /opt/app

# Checkout previous version
git checkout <previous-commit-hash>

# Restart containers
docker compose up -d --build
```

---

## 📈 Monitoring & Logs

### View Logs:
**On Deployment Server:**
```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f node_backend
docker compose logs -f react_frontend
docker compose logs -f python_backend
```

**On Jenkins:**
- Build console output shows all stages
- Email notifications include build status
- Build history tracks all deployments

---

## 🚨 Failure Points & Recovery

| Failure Point | Impact | Recovery |
|--------------|--------|----------|
| Git clone fails | Pipeline stops | Check network, repo access |
| Docker build fails | Pipeline stops | Fix Dockerfile, check dependencies |
| Ansible connection fails | Pipeline stops | Check SSH key, server accessibility |
| Container startup fails | Deployment incomplete | Check logs, fix configuration |
| Health check fails | Unstable status | Check application code |

---

## 📝 Summary

**WHAT:** Automated CI/CD pipeline for AiInterview application  
**WHERE:** 
- Jenkins Server (builds, tests, orchestrates)
- Deployment Server 23.20.67.153 (hosts application)

**WHEN:** 
- Manual trigger
- Git push (if webhook configured)
- Scheduled (if configured)

**HOW:**
1. Code checked out from GitHub
2. Validated and tested on Jenkins
3. Docker images built and validated
4. Deployed to EC2 server via Ansible
5. Containers started and verified
6. Email notification sent

**RESULT:**
- Fully automated deployment
- Consistent builds
- Quick rollback capability
- Email notifications for status

---

**Total Deployment Time:** ~10-11 minutes  
**Services Deployed:** 4 containers (Frontend, Backend, Python Backend, MongoDB)  
**Email Recipient:** suryansh1440@gmail.com

