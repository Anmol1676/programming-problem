## Prerequisites
Before you begin, please ensure you have Docker desktop installed on your machine. If you don't have Docker yet, you can download it from Docker Desktop.
    https://www.docker.com/products/docker-desktop/


## Getting started

1) Clone the repository
    First, clone the Git repository to your local machine 
        

2) Navigate to the Project Directory
    Change to the project directory in your terminal


3) Start Docker
    Use Docker Compose to build and start the project:
        docker-compose up --build 

4) Access the Application
    Once Docker has finished setting up, you can access the application by navigating to:
        http://localhost:3000

## Closing the Application

When you're done, you can shut down the Docker environment. To do this, use the following command:
    CTRL C
    docker-compose down -v
