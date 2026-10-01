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

    }

    post {
        success {
            echo 'SafeEvent Build and Tests completed successfully!'
        }

        failure {
            echo 'SafeEvent Build or Tests failed!'
        }
    }
}