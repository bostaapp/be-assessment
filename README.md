Welcome to the Uptime Monitoring RESTful API Web App! This application allows authenticated users to monitor URLs and retrieve detailed uptime reports, including availability, average response time, and total uptime/downtime. This README provides an overview of the project, installation instructions, and usage guidelines.

Introduction:
The Uptime Monitoring RESTful API Web App is designed to help users monitor the availability of URLs and gather important statistics about their performance.

Technologies Used:
Node.js: The server-side runtime environment used for building the API.
MongoDB: The NoSQL database for storing user data, URLs, and uptime reports.
AWS Cognito: The authentication service for secure user registration and login.

Features:
User Registration: New users can sign up and create an account and verify it using AWS Cognito.
User Authentication: Secure login and access control for registered users using AWS Cognito.
URL Monitoring: Authenticated users can add URLs to monitor their uptime.
Uptime Reports: Users can retrieve detailed reports on URL availability, average response time, and total uptime/downtime.

Docker:
build Docker: docker build -t "Appname".
run Docker to test the build: docker run -p 3000:3000 "Appname".

Dont't forget to create .env file and write your variables