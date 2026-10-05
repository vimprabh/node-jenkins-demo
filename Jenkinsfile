pipeline {

    agent any

    environment {
        PORT = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Node') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Stopping old application if running"

                    if [ -f app.pid ]; then
                        kill $(cat app.pid) || true
                        rm -f app.pid
                    fi

                    echo "Starting application"

                    nohup node app.js > app.log 2>&1 &
                    echo $! > app.pid

                    sleep 3
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    curl --fail http://localhost:${PORT}/health
                '''
            }
        }

    }

    post {

        success {
            echo 'Node.js application deployed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }

    }

}