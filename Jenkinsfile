pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'vimprabh/node-jenkins-demo'
        CONTAINER_NAME = 'node-jenkins-demo'
        APP_PORT = '3002'

        PATH = "/opt/homebrew/bin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Tools') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Docker version:"
                    docker --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Unit Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                        -t ${DOCKER_IMAGE}:latest \
                        .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Remove Local Image') {
            steps {
                sh '''
                    docker image rm ${DOCKER_IMAGE}:${BUILD_NUMBER} || true
                    docker image rm ${DOCKER_IMAGE}:latest || true
                '''
            }
        }

        stage('Pull from Docker Hub') {
            steps {
                sh '''
                    docker pull ${DOCKER_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Docker Run') {
            steps {
                sh '''
                    echo "Stopping existing container"

                    docker rm -f ${CONTAINER_NAME} || true

                    echo "Starting new container"

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:3000 \
                        ${DOCKER_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 5

                    echo "Checking application health"

                    curl --fail \
                        http://localhost:${APP_PORT}/health
                '''
            }
        }
    }

    post {

        success {
            echo '''
            ===================================
            Deployment Successful
            ===================================
            '''
        }

        failure {
            sh '''
                echo "Pipeline failed"
                docker logs ${CONTAINER_NAME} || true
            '''
        }
    }
}