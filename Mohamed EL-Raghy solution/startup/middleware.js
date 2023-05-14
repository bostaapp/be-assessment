const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'uptime monitoring',
      version: '1.0.0',
      description: ""
    }
  },
  apis: ['./routes/*.yml'],
};

const specs = swaggerJsDoc(options);

module.exports = app => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs)); //* API Docs

  app.use(express.json());          //*  consuming and producing application/json

  app.use((req, res, next) => {     //!  solvine CORS ERORR to share resources with Front-end
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");    
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
} 