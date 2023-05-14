# uptime-monitoring

This is a Uptime Monitoring API that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Requirements

- Node.js (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
  `https://github.com/mohamedelraghy/uptime-monitoring.git`

2. Install the dependencies:
    
```bash
  cd uptime-monitoring
  npm install
```
  

## Running the API

setup your environment variables

```bash
  touch .env
  echo 'export NODE_MAILER_KEY=YOUR_NODE_MAILER_KEY' >> .env
  echo 'export JWT_KEY=YOU_JWT_KEY' >> .env
  echo 'export ENV=test' >> .env

  source .env
````

To start the API, run the following command:
```bash
  npm start
```    
This will start the API server at `http://localhost:3000`.

## API Documentation

You can view the API documentation by visiting `http://localhost:3000/api-docs` in your web browser.

 OR

[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/7215796-ba016176-08a9-48e4-8ff8-c713354d014d?action=collection%2Ffork&collection-url=entityId%3D7215796-ba016176-08a9-48e4-8ff8-c713354d014d%26entityType%3Dcollection%26workspaceId%3D81008f9e-6ad1-4807-bbc2-cfaa66b78dd4)

## Testing

before Testing, setup test Environment variables:

```bash
touch .env.test
echo 'export NODE_MAILER_KEY=YOUR_NODE_MAILER_KEY' >> .env.test
echo 'export JWT_KEY=YOUR_JWT_KEY' >> .env.test
echo 'export MONGODB_URI=YOU_TEST_MONGODB_URL' >> .env.test

source .env.test
```

To run the API tests, use the following command:
```bash
  npm test
```
This will run the tests using Jest and generate a coverage report.


## docker 

  you could use docker just run this command
```bash
  docker-compose up
```
  and it will do the magic for you

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request