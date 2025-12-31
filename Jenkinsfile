pipeline {
    agent any
    
    environment {
        // Ansible configuration
        ANSIBLE_INVENTORY = 'ansible/inventory.ini'
        ANSIBLE_DEPLOY_PLAYBOOK = 'ansible/deploy.yml'
        ANSIBLE_SETUP_PLAYBOOK = 'ansible/setup.yml'
        
        // Docker configuration
        DOCKER_BUILDKIT = '1'
        COMPOSE_DOCKER_CLI_BUILD = '1'
        
        // Application paths
        APP_DIR = '/opt/app'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out code from repository...'
                    checkout scm
                }
            }
        }
        
        stage('Validate') {
            steps {
                script {
                    echo 'Validating project structure...'
                    sh '''
                        echo "Checking required files..."
                        test -f docker-compose.yml || exit 1
                        test -f ansible/deploy.yml || exit 1
                        test -f ansible/inventory.ini || exit 1
                        echo "✓ All required files present"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            echo 'Installing backend dependencies...'
                            dir('backend') {
                                sh '''
                                    if [ -f package.json ]; then
                                        npm ci --production=false
                                        echo "✓ Backend dependencies installed"
                                    else
                                        echo "⚠ No package.json found in backend"
                                    fi
                                '''
                            }
                        }
                    }
                }
                
                stage('Frontend Dependencies') {
                    steps {
                        script {
                            echo 'Installing frontend dependencies...'
                            dir('client') {
                                sh '''
                                    if [ -f package.json ]; then
                                        npm ci --production=false
                                        echo "✓ Frontend dependencies installed"
                                    else
                                        echo "⚠ No package.json found in client"
                                    fi
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Lint & Test') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        script {
                            echo 'Running backend linting...'
                            dir('backend') {
                                sh '''
                                    if [ -f package.json ] && grep -q "\"lint\"" package.json; then
                                        npm run lint || echo "⚠ Linting issues found (non-blocking)"
                                    else
                                        echo "⚠ No lint script found"
                                    fi
                                '''
                            }
                        }
                    }
                }
                
                stage('Frontend Lint') {
                    steps {
                        script {
                            echo 'Running frontend linting...'
                            dir('client') {
                                sh '''
                                    if [ -f package.json ] && grep -q "\"lint\"" package.json; then
                                        npm run lint || echo "⚠ Linting issues found (non-blocking)"
                                    else
                                        echo "⚠ No lint script found"
                                    fi
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo 'Building Docker images locally for validation...'
                    sh '''
                        docker compose build --no-cache || {
                            echo "❌ Docker build failed"
                            exit 1
                        }
                        echo "✓ Docker images built successfully"
                    '''
                }
            }
            post {
                always {
                    script {
                        echo 'Cleaning up Docker images after validation...'
                        sh '''
                            # Remove all built images to free up space
                            docker compose down --rmi all --volumes --remove-orphans || true
                            docker system prune -af --volumes || true
                            echo "✓ Docker cleanup completed"
                        '''
                    }
                }
            }
        }
        
        stage('Check Ansible') {
            steps {
                script {
                    echo 'Checking Ansible installation...'
                    sh '''
                        # Ensure /usr/bin is in PATH for this script
                        export PATH="/usr/bin:/usr/local/bin:$PATH"
                        
                        # Check if ansible-playbook exists (try multiple methods)
                        if [ -f /usr/bin/ansible-playbook ]; then
                            ANSIBLE_CMD="/usr/bin/ansible-playbook"
                        elif command -v ansible-playbook &> /dev/null; then
                            ANSIBLE_CMD="ansible-playbook"
                        elif which ansible-playbook &> /dev/null; then
                            ANSIBLE_CMD=$(which ansible-playbook)
                        else
                            echo "❌ Ansible is not installed"
                            echo "Please install Ansible on Jenkins server:"
                            echo "  sudo apt update"
                            echo "  sudo apt install -y ansible"
                            exit 1
                        fi
                        
                        # Verify and show version
                        $ANSIBLE_CMD --version
                        echo "✓ Ansible is ready"
                    '''
                }
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                script {
                    echo 'Deploying application to server...'
                    sshagent(credentials: ['app-ec2-ssh-key']) {
                        sh '''
                            # Set up SSH for Ansible
                            export ANSIBLE_HOST_KEY_CHECKING=False
                            export ANSIBLE_SSH_COMMON_ARGS='-o StrictHostKeyChecking=no'
                            
                            # Verify inventory file exists
                            if [ ! -f ${ANSIBLE_INVENTORY} ]; then
                                echo "❌ Inventory file not found: ${ANSIBLE_INVENTORY}"
                                exit 1
                            fi
                            
                            # Verify playbook exists
                            if [ ! -f ${ANSIBLE_DEPLOY_PLAYBOOK} ]; then
                                echo "❌ Playbook not found: ${ANSIBLE_DEPLOY_PLAYBOOK}"
                                exit 1
                            fi
                            
                            # Run deployment
                            # The inventory.ini already specifies ansible_user=ubuntu
                            # The playbook uses become: true for sudo access
                            # sshagent automatically handles SSH key forwarding
                            ansible-playbook \
                                -i ${ANSIBLE_INVENTORY} \
                                ${ANSIBLE_DEPLOY_PLAYBOOK} \
                                --become \
                                -v
                            
                            if [ $? -eq 0 ]; then
                                echo "✓ Deployment completed successfully"
                            else
                                echo "❌ Deployment failed"
                                exit 1
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo 'Verifying deployment...'
                    sshagent(credentials: ['app-ec2-ssh-key']) {
                        sh '''
                            # Wait for containers to start
                            echo "Waiting for containers to start..."
                            sleep 20
                            
                            # Verify containers are running using Ansible
                            export ANSIBLE_HOST_KEY_CHECKING=False
                            export ANSIBLE_SSH_COMMON_ARGS='-o StrictHostKeyChecking=no'
                            
                            # Check container status
                            echo "Checking container status..."
                            ansible app \
                                -i ${ANSIBLE_INVENTORY} \
                                --become \
                                -m shell \
                                -a "cd /opt/app && docker compose ps" \
                                -u ubuntu
                            
                            echo "✓ Deployment verification completed"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo 'Cleaning up...'
                sh '''
                    # Clean up Docker images to save space
                    docker system prune -f || true
                    echo "Cleanup completed"
                '''
            }
        }
        
        success {
            mail(
                to: 'suryansh1440@gmail.com',
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "Job '${env.JOB_NAME}' (${env.BUILD_URL}) completed successfully. The application has been deployed to the server."
            )
        }
        
        failure {
            mail(
                to: 'suryansh1440@gmail.com',
                subject: "❌ FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "Job '${env.JOB_NAME}' (${env.BUILD_URL}) failed. Please check the build logs for details."
            )
        }
        
        unstable {
            mail(
                to: 'suryansh1440@gmail.com',
                subject: "⚠️ UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "Job '${env.JOB_NAME}' (${env.BUILD_URL}) is unstable. The pipeline completed but with warnings or test failures."
            )
        }
    }
}

