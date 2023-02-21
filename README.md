# Bosta Task

## Technologies

- Express js
- Mongo DB
- Send in blue
- Docker
- Cron jobs

## Installation and Run

Install docker and docker-compose before starting this installation process.

1. Download The Repository Files
2. Make Sure These Ports are available `Port:3000(API)` `Port:27017 (DB)`
3. In the terminal run `docker-compose up --build`

## Database

### Description

There are three different collections : `Users`, `Checks` and `Reports`. with 1-N relationship between Users and Checks and 1-N relationship between Checks and Reports.

## API Routes

There is a file collection.json file have all the routes with the required params

Registeration

### Users

#### Create User

##### POST User

    POST /api/users/

#### Verify your email address

##### POST /verify

    POST /api/users/verify

#### Login

##### POST Login

    POST /api/auth/login

### Checks

#### Create A Check

##### POST /checks

    POST /api/checks

#### Get All

##### GET /api/checks

    GET /api/checks?token="your_auth_token"?

#### Get By Tag

##### GET /api/checks

    GET /api/checks?token="your_auth_token"&tags=tag1,tag2,....

#### Update By Name

##### PUT /api/checks

    PUT /api/reports?token="your_auth_token"&checkName="name"

#### Delete By Name

##### PUT /api/checks

    PUT /api/reports?token="your_auth_token"&checkName="name"

### Reports

#### Get All

##### GET /api/reports

    GET /api/reports?token="your_auth_token"

#### Get By Tag

##### GET /api/reports

    GET /api/reports?token="your_auth_token"&tags=tag1,tag2,....
