# Backend Assessment

Build an uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Project setup
- install dependencies
``` 
npm install
```
## env setup
- create .env file
- add to .env file the following :
```
MONGO_URI=
SECRET_KEY=
SALT_ROUNDS=
EMAIL_USER=
EMAIL_PASS=
PORT=
BASE_URL=http://localhost:${PORT}
```
## run project
```
tsc
npm start
```