# Transition Website
![backend_service](https://github.com/tiffany831101/transition_website/assets/39373272/9478e494-9e03-448d-8862-42bf3b7b29f2)

## Table of Contents
- [Transition Website](#transition-website)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Architecture](#architecture)
  - [Installation and Usage](#installation-and-usage)
  - [Technologies](#technologies)

## Overview
This backend service serves as a foundation for user authentication and resume management, offering the following core functionalities:

1. **User Authentication:** Implementing a secure user authentication system is crucial for any modern application. TThis service employs industry-standard practices, utilizing JSON Web Token (JWT) authorization to ensure robust authentication while maintaining user privacy. Additionally, seamless Google authentication integration enhances user experience and security.

2. **Resume Creation and Export:** One of the core features of our service is the ability for users to effortlessly create and export their resumes in both PDF and HTML formats. This empowers users to generate professional resumes with ease and flexibility.

## Architecture
To achieve its objectives, this backend service leverages the following architecture and technologies:
- **Microservices:** We embrace a microservices architecture to enhance modularity, scalability, and maintainability. Our services include:
  - **Login Service:** Responsible for user authentication and authorization.
  - **Resume Service:** Facilitates resume creation and export functionalities.
  - **Nginx Service:** Acts as a reverse proxy and load balancer, routing requests to different microservices for efficient handling.


- **Cloud Infrastructure:** We utilize AWS services such as:
  - **S3:** For secure storage of HTML files and resume images.
  - **DynamoDB:** serves as a flexible and serverless NoSQL database, ensuring seamless data persistence for user and resume data with its serverless architecture
  - **ECS:** utilized as our AWS managed container orchestration service, where services are orchestrated using EC2 instances in order to gain precise resource control and configuration capabilities
  - **Elastic Load Balancer (ELB):** distributes incoming traffic to the target group, which consists of services running multiple tasks, ensuring optimal resource utilization and efficient handling of user requests.

- **Monitoring and Logging:** 
  - **Grafana and Prometheus:** Monitors API requests.
  - **CloudWatch:** Monitors ECS memory and CPU usage.
  - **Elasticsearch:** Collects and analyzes logs.
- **Authentication:**
  - **JWT:** Clients need to include the JWT token in the authorization header.
  - **Google Account Integration:** Google OAuth2.0 Authentication

## Installation and Usage

1. Clone the repository.
2. Run Login Service
   - `cd services`
   - `cd login`
   - `npm install`
   - `npm run dev`
3. Run Resume Service
   - `cd services`
   - `cd resume`
   - `npm install`
   - `npm run dev`

## Technologies
  - **Cloud Services and Infrastructure:**
    - Amazon ECS
    - Amazon S3
    - Amazon DynamoDB
    - Elastic Load Balancer (ELB)
  - **Server and Networking:**

    - Nginx

  - **Authentication and Security:**
    - JSON Web Token (JWT)
    - Google OAuth 2.0

  - **Containerization:**
    - Docker
