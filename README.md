# Backend Assessment

Build an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## run

create .env file and write your variables

- `npm start`

## test

- `npm test`
- `npm devtest` for automatic refresh for tests

## Docker

run this command to run docker compose

- `docker-compose --env-file .env  up -d`

## env.example variables

- `DATABASE_URL = ` mongodb connection string
- `TOKEN_SECRET = ` token secret for jwt
- `URL = "http://localhost:3000"`
- `MAIL_USER` any email to send verification emails with as the sender
- `NODEMAIL_AUTH_USER = `
- `NODEMAIL_AUTH_PASS = `
- `NODEMAIL_AUTH_PORT = 2525` or whatever you are given in the mail api
- `NODEMAIL_AUTH_HOST = "sandbox.smtp.mailtrap.io"` or whatever you are given in the mail api

## packeges used

- `axios`
- `bcrypt`
- `body-parser`
- `dotenv`
- `express`
- `https`
- `jsonwebtoken`
- `mongoose`
- `nodemailer`
- `uuid`
- `jest`
- `supertest`

## Overview

- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook _(optional)_.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.

## Acceptance Criteria

- APIs should be consuming and producing `application/json`.
- Authenication should be stateless.
- Each URL check may have the following options:
  - `name`: The name of the check.
  - `url`: The URL to be monitored.
  - `protocol`: The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
  - `path`: A specific path to be monitored _(optional)_.
  - `port`: The server port number _(optional)_.
  - `webhook`: A webhook URL to receive a notification on _(optional)_.
  - `timeout` _(defaults to 5 seconds)_: The timeout of the polling request _(optional)_.
  - `interval` _(defaults to 10 minutes)_: The time interval for polling requests _(optional)_.
  - `threshold` _(defaults to 1 failure)_: The threshold of failed requests that will create an alert _(optional)_.
  - `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request _(optional)_.
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
