pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building SafeEvent Backend...'

                bat '''
                    cd backend
                    mvnw.cmd clean package -DskipTests=false
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running SafeEvent Tests...'

                bat '''
                    cd backend
                    mvnw.cmd test
                '''
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building SafeEvent Docker Image...'

                bat '''
                    cd backend
                    docker build -t safeevent-backend:latest .
                '''
            }
        }

    }

    post {
        success {
            echo 'SafeEvent Build, Tests and Docker Image completed successfully!'
        }

        failure {
            echo 'SafeEvent Build, Tests or Docker Build failed!'
        }
    }
}