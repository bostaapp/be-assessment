# Backend Assessment

Build an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

# API Documentation "<<<<Warning>>>>"

- The documentation at the end of the README.

## Overview

- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook *(optional)*.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.

## Acceptance Criteria

- APIs should be consuming and producing `application/json`.
- Authenication should be stateless.
- Each URL check may have the following options:
  - `name`: The name of the check.
  - `url`: The URL to be monitored.
  - `protocol`: The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
  - `path`: A specific path to be monitored *(optional)*.
  - `port`: The server port number *(optional)*.
  - `webhook`: A webhook URL to receive a notification on *(optional)*.
  - `timeout` *(defaults to 5 seconds)*: The timeout of the polling request *(optional)*.
  - `interval` *(defaults to 10 minutes)*: The time interval for polling requests *(optional)*.
  - `threshold` *(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*.
  - `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*.
    - `authentication.username`
    - `authentication.password`
  - `httpHeaders`: A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  - `assert`: The response assertion to be used on the polling response (optional).
    - `assert.statusCode`: An HTTP status code to be asserted.
  - `tags`: A list of the check tags (optional).
  - `ignoreSSL`: A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.
- Each report may have the following information:
  - `status`: The current status of the URL.
  - `availability`: A percentage of the URL availability.
  - `outages`: The total number of URL downtimes.
  - `downtime`: The total time, in seconds, of the URL downtime.
  - `uptime`: The total time, in seconds, of the URL uptime.
  - `responseTime`: The average response time for the URL.
  - `history`: Timestamped logs of the polling requests.

## Evaluation Criteria

- Code quality.
- Code scalability as we should be able to add a new alerting notification channel like Slack, Firebase, SMS, etc.. with the minimum possible changes.
- Unit tests.

## Bonus

- API documentation.
- Docker and Docker Compose.
- [Pushover](https://pushover.net/) integration to receive alerts on mobile devices.

Try your best to implement as much as you can from the given requirements and feel free to add more if you want to.

# API Documentation

- This documentation explain how to use the poject and what is used.

## Introduction

- This is an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Description
### What database is used:
- We are using mongodb as our database which creates 4 schemas (User, Check, Report, Verification).
- Each user has multiple check and each check has one report.

### What packages are used:
#### dependencies
- nodejs
- express
- mongoose
- nodemailer
- axios
- bcryptjs
- body-parser
- dotenv
- jsonwebtoken
- uuidv4

#### devDependencies
- chai
- mocha
- nodemon

## API Endpoints

- POST /api/signup

  POST http://localhost:3000/signup
  
  This endpoint allows a user to register by providing a email, password, and confirm password. The server will hash the password using bcrypt package and then store user data into the database.
  
  - Request Body
   
	 | Field  | Type  | Description |
	 | :------------ |:---------------| :-----|
	 | username      | string | The user's email |
	 | password      | string | The user's password |
	 | confirm password      | string | The user's confirm password |
  
  - Response
  
    If successful, this endpoint will return a uniqe id for user which will be send as a mail for him in the form of url to that the user can use to verify email with other endpoints.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| verificationId      | string | unique string |
	| message      | string        |   explains the response |          
    
- GET /api/verification

  GET http://localhost:3000/verification/{{token_id}}
  
  This endpoint allows a user to verify his email. The server will will change the verification state of the user from false to true so he can login.
  
  - Request Body
   
   	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
  
  - Response
  
    If successful, this endpoint will return a success message.
    
    	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| message      | string        |   explains the response |
		
- POST /api/login

  POST http://localhost:3000/login
  
  This endpoint allows a user to log in and receive a JWT token for authentication.
  
  - Request Body
   
   	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| username      | string | The user's email |
	| password      | string | The user's password |
  
  - Response
  
    If successful, this endpoint will return a JWT token that the user can use to authenticate with other endpoints and a success message.
    
    	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| token      | string | JWT token |
	| message      | string        |   explains the response |
		
- POST /api/checks

  POST http://localhost:3000/checks/?page=1&size=2&tags=["tag1", "tag2"]
  
  This endpoint allows an authenticated user to retrieve all (or some using pagination) URLs (checks) they are currently monitoring with or without tags.
  
  - Request Body
   
   	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| page      | number | The page number |
	| size      | number | The number of checks in each page |
	| tag      | array of strings | The tags that each check owns |
  
  - Response
  
    This endpoint will return an array of URLs that the user is currently monitoring, including their uptime, average response time, total uptime/downtime, and etc...
		
   	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| id      | objcetId | check id |
	| name      | string        |   check's name |
	| url      | string        |   check's url |
	| protocol      | number        |   check's protocol |
	| path      | string        |   check's path |
	| port      | number        |   check's port |
	| webhook      | string        |   check's webhook |
	| timeout      | number        |   check's timout |
	| threshold      | number        |   check's threshold |
	| interval      | number        |   check's interval |
	| httpHeaders      | array of objects        |   check's httpHeaders |
	| assert      | object of statusCode number        |   check's assert |
	| tags      | array of strings        |   check's tags |
	| ignoreSSL      | boolean        |   check's ignoreSSL |
	| user      | objecId        |   check's user |
	| authentication      | object of username(email) and password        |   check's authentication |
	| message      | string        |   explains the response |
	 
- POST /api/checks

  POST http://localhost:3000/checks
  
  This endpoint allows an authenticated user to add a new URL (check) to be monitored.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| id      | objcetId | check id |
	| name      | string        |   check's name |
	| url      | string        |   check's url |
	| protocol      | number        |   check's protocol |
	| path      | string        |   check's path |
	| port      | number        |   check's port |
	| webhook      | string        |   check's webhook |
	| timeout      | number        |   check's timout |
	| threshold      | number        |   check's threshold |
	| interval      | number        |   check's interval |
	| httpHeaders      | array of objects        |   check's httpHeaders |
	| assert      | object of statusCode number        |   check's assert |
	| tags      | array of strings        |   check's tags |
	| ignoreSSL      | boolean        |   check's ignoreSSL |
	| user      | objecId        |   check's user |
	| authentication      | object of username(email) and password        |   check's authentication |
  
  - Response
  
    If successful, this endpoint will return the newly created URL.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| check      | object | check data |
	| message      | string        |   explains the response |
	
- put /api/checks

  put http://localhost:3000/checks/{{check_id}}
  
  This endpoint allows an authenticated user to update a existing URL (check) to be monitored.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| id      | objcetId | check id |
	| name      | string        |   check's name |
	| url      | string        |   check's url |
	| protocol      | number        |   check's protocol |
	| path      | string        |   check's path |
	| port      | number        |   check's port |
	| webhook      | string        |   check's webhook |
	| timeout      | number        |   check's timout |
	| threshold      | number        |   check's threshold |
	| interval      | number        |   check's interval |
	| httpHeaders      | array of objects        |   check's httpHeaders |
	| assert      | object of statusCode number        |   check's assert |
	| tags      | array of strings        |   check's tags |
	| ignoreSSL      | boolean        |   check's ignoreSSL |
	| user      | objecId        |   check's user |
	| authentication      | object of username(email) and password        |   check's authentication |
  
  - Response
  
    If successful, this endpoint will return the updated URL.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| check      | object | check data |
	| message      | string        |   explains the response |
	
- get /api/checks

  get http://localhost:3000/checks/{{check_id}}
  
  This endpoint allows an authenticated user to retrieve a existing URL (check) to be monitored.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
  
  - Response
  
    If successful, this endpoint will return the URL.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| check      | object | check data |
	| message      | string        |   explains the response |
	
- delete /api/checks

  delete http://localhost:3000/checks/{{check_id}}
  
  This endpoint allows an authenticated user to delete a existing URL (check) to be monitored.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
  
  - Response
  
    If successful, this endpoint will return a deleting message.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| message      | string        |   explains the response |
	
- GET /api/reports

  GET http://localhost:3000/reports/{{report_id}}
  
  This endpoint allows an authenticated user to retrieve a existing URL's (check) report to be monitored.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
  
  - Response
  
    If successful, this endpoint will return s existing URL's (check) report and a message.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| report      | object        |   report data |
	| check      | object        |   check data |
	| message      | string        |   explains the response |
	
- GET /api/reports

  GET http://localhost:3000/reports/?page=1&size=2&tags=["tag1", "tag2"]
  
  This endpoint allows an authenticated user to retrieve all (or some of them using pagination) the existing URL's (check) report to be monitored with or without tags.
  
	- Headers
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| authorization      | string | JWT token in the format 'Bearer token' |
	
  - Request Body
   
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| page      | number | The page number |
	| size      | number | The number of checks in each page |
	| tag      | array of strings | The tags that each check owns |
  
  - Response
  
    If successful, this endpoint will return s existing URL's (check) report and a message.
		
	| Field  | Type  | Description |
	| :------------ |:---------------| :-----|
	| report      | object        |   contains report data amd its check data |
	| message      | string        |   explains the response |
		
   
	 
	 
    
    
